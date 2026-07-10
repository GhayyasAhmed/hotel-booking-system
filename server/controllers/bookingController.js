import Hotel from "../models/hotelModel.js";
import Room from "../models/roomModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";
import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import sendEmail from "../utils/sendEmail.js";
import stripe from "stripe";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const validateBookingDates = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) {
        throw new ErrorHandler("Check-in and check-out dates are required.", 400);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
        throw new ErrorHandler("Please provide valid check-in and check-out dates.", 400);
    }

    if (checkOut <= checkIn) {
        throw new ErrorHandler("Check-out date must be after check-in date.", 400);
    }

    return { checkIn, checkOut, nights: Math.ceil((checkOut - checkIn) / DAY_IN_MS) };
};

const checkAvailability = async (room, checkInDate, checkOutDate, excludeBookingId) => {
    const { checkIn, checkOut } = validateBookingDates(checkInDate, checkOutDate);

    const filter = {
        room,
        status: { $ne: "cancelled" },
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
    };

    if (excludeBookingId) {
        filter._id = { $ne: excludeBookingId };
    }

    const overlappingBooking = await Booking.findOne(filter);

    return !overlappingBooking;
};

const getBookingForAccess = async (bookingId, userId) => {
    const booking = await Booking.findById(bookingId).populate("room hotel user");

    if (!booking) {
        throw new ErrorHandler("Booking not found.", 404);
    }

    const isBookingUser = booking.user?._id?.toString() === userId || booking.user?.toString() === userId;
    const isHotelOwner = booking.hotel?.owner?.toString() === userId;

    if (!isBookingUser && !isHotelOwner) {
        throw new ErrorHandler("You can only access your own bookings.", 403);
    }

    return { booking, isBookingUser, isHotelOwner };
};

export const checkAvailabilityOfRoom = catchAsyncError(async (req, res, next) => {
    const { room, checkInDate, checkOutDate } = req.body;

    if (!room) {
        return next(new ErrorHandler("Room id is required.", 400));
    }

    const roomData = await Room.findById(room);
    if (!roomData) {
        return next(new ErrorHandler("Room not found.", 404));
    }

    if (!roomData.isAvailable) {
        return res.status(200).json({ success: true, isAvailable: false });
    }

    const isAvailable = await checkAvailability(room, checkInDate, checkOutDate);

    res.status(200).json({ success: true, isAvailable });
});

export const createBooking = catchAsyncError(async (req, res, next) => {
    const { room, checkInDate, checkOutDate, guests } = req.body;

    if (!room) {
        return next(new ErrorHandler("Room id is required.", 400));
    }

    if (!guests || Number(guests) <= 0) {
        return next(new ErrorHandler("At least one guest is required.", 400));
    }

    const { nights } = validateBookingDates(checkInDate, checkOutDate);
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
        return next(new ErrorHandler("Room not found.", 404));
    }

    if (!roomData.hotel) {
        return next(new ErrorHandler("Hotel for this room was not found.", 404));
    }

    if (!roomData.isAvailable) {
        return next(new ErrorHandler("Room is currently unavailable.", 409));
    }

    const isAvailable = await checkAvailability(room, checkInDate, checkOutDate);
    if (!isAvailable) {
        return next(new ErrorHandler("Room is not available for the selected dates.", 409));
    }

    const totalPrice = roomData.pricePerNight * nights;
    const booking = await Booking.create({
        user: req.user._id,
        room,
        hotel: roomData.hotel._id,
        guests: Number(guests),
        checkInDate,
        checkOutDate,
        totalPrice
    });

    await sendEmail({
        email: req.user.email,
        subject: "Hotel Booking Details",
        html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your booking! Here are your details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
                    <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
                    <li><strong>Booking Amount:</strong> $${booking.totalPrice}</li>
                </ul>
                <p>We look forward to welcoming you!</p>
            `
    }).catch(() => null);

    return res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        booking
    });
});

export const getUserBookings = catchAsyncError(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("room hotel")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
});

export const getHotelBookings = catchAsyncError(async (req, res, next) => {
    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) {
        return next(new ErrorHandler("No hotel found for this user.", 404));
    }

    const bookings = await Booking.find({ hotel: hotel._id })
        .populate("room hotel user")
        .sort({ createdAt: -1 });
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.status(200).json({ success: true, data: { totalBookings, totalRevenue, bookings } });
});

export const getBookingById = catchAsyncError(async (req, res) => {
    const { booking } = await getBookingForAccess(req.params.id, req.user._id);

    res.status(200).json({ success: true, booking });
});

export const updateBooking = catchAsyncError(async (req, res, next) => {
    const { booking, isBookingUser, isHotelOwner } = await getBookingForAccess(req.params.id, req.user._id);

    if (booking.status === "cancelled") {
        return next(new ErrorHandler("Cancelled bookings cannot be updated.", 409));
    }

    const updates = {};

    if (isBookingUser) {
        if (booking.isPaid) {
            return next(new ErrorHandler("Paid bookings cannot be edited by the guest.", 409));
        }

        const nextCheckIn = req.body.checkInDate || booking.checkInDate;
        const nextCheckOut = req.body.checkOutDate || booking.checkOutDate;
        const nextGuests = req.body.guests !== undefined ? Number(req.body.guests) : booking.guests;

        if (req.body.guests !== undefined && nextGuests <= 0) {
            return next(new ErrorHandler("At least one guest is required.", 400));
        }

        if (req.body.checkInDate !== undefined || req.body.checkOutDate !== undefined) {
            const { nights } = validateBookingDates(nextCheckIn, nextCheckOut);
            const isAvailable = await checkAvailability(
                booking.room._id || booking.room,
                nextCheckIn,
                nextCheckOut,
                booking._id
            );

            if (!isAvailable) {
                return next(new ErrorHandler("Room is not available for the selected dates.", 409));
            }

            updates.checkInDate = nextCheckIn;
            updates.checkOutDate = nextCheckOut;
            updates.totalPrice = booking.room.pricePerNight * nights;
        }

        if (req.body.guests !== undefined) updates.guests = nextGuests;
    }

    if (isHotelOwner) {
        if (req.body.status !== undefined) {
            if (!["pending", "confirmed", "cancelled"].includes(req.body.status)) {
                return next(new ErrorHandler("Invalid booking status.", 400));
            }
            updates.status = req.body.status;
        }
        if (req.body.isPaid !== undefined) updates.isPaid = Boolean(req.body.isPaid);
        if (req.body.paymentMethod !== undefined) updates.paymentMethod = req.body.paymentMethod;
    }

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("Please provide at least one booking field to update.", 400));
    }

    const updatedBooking = await Booking.findByIdAndUpdate(booking._id, updates, {
        new: true,
        runValidators: true
    }).populate("room hotel user");

    res.status(200).json({
        success: true,
        message: "Booking updated successfully.",
        booking: updatedBooking
    });
});

export const updateBookingStatus = catchAsyncError(async (req, res, next) => {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return next(new ErrorHandler("Invalid booking status.", 400));
    }

    const { booking, isHotelOwner } = await getBookingForAccess(req.params.id, req.user._id);

    if (!isHotelOwner) {
        return next(new ErrorHandler("Only the hotel owner can update booking status.", 403));
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: "Booking status updated successfully.", booking });
});

export const cancelBooking = catchAsyncError(async (req, res) => {
    const { booking } = await getBookingForAccess(req.params.id, req.user._id);

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled successfully.", booking });
});

export const deleteBooking = catchAsyncError(async (req, res) => {
    const { booking } = await getBookingForAccess(req.params.id, req.user._id);

    await Review.deleteMany({ booking: booking._id });
    await Booking.findByIdAndDelete(booking._id);

    res.status(200).json({ success: true, message: "Booking deleted successfully." });
});

export const stripePayment = catchAsyncError(async (req, res, next) => {
    const { bookingId } = req.body;
    const { origin } = req.headers;

    if (!bookingId) {
        return next(new ErrorHandler("Booking id is required.", 400));
    }

    if (!origin) {
        return next(new ErrorHandler("Request origin is required to create a payment session.", 400));
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return next(new ErrorHandler("Stripe is not configured on the server.", 500));
    }

    const { booking, isBookingUser } = await getBookingForAccess(bookingId, req.user._id);

    if (!isBookingUser) {
        return next(new ErrorHandler("Only the booking owner can pay for this booking.", 403));
    }

    if (booking.status === "cancelled") {
        return next(new ErrorHandler("Cancelled bookings cannot be paid.", 409));
    }

    if (booking.isPaid) {
        return next(new ErrorHandler("Booking is already paid.", 409));
    }

    const roomData = await Room.findById(booking.room._id || booking.room).populate("hotel");
    if (!roomData) {
        return next(new ErrorHandler("Room for this booking was not found.", 404));
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: roomData.hotel.name
                    },
                    unit_amount: Math.round(booking.totalPrice * 100)
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${origin}/loader/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        metadata: {
            bookingId
        }
    });

    res.status(200).json({ success: true, url: session.url });
});
