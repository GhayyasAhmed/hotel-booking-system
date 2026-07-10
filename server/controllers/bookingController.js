import Hotel from "../models/hotelModel.js";
import User from "../models/userModel.js";
import Room from "../models/roomModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorhandler.js"
import Booking from "../models/bookingModel.js";
import sendEmail from "../utils/sendEmail.js";
import stripe from 'stripe';

// function to check availability of room
const checkAvailability = async (room, checkInDate, checkOutDate) => {

    const bookings = await Booking.find({
        room,
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate }
    })

    const isAvailable = bookings.length === 0;

    return isAvailable
}

// api to check availability of room

export const checkAvailabilityOfRoom = catchAsyncError(async (req, res, next) => {
    const { room, checkInDate, checkOutDate } = req.body

    const isAvailable = await checkAvailability(room, checkInDate, checkOutDate)

    res.status(200).json({ success: true, isAvailable })
})


// api to create new booking

// POST /api/bookings/book

export const createBooking = catchAsyncError(async (req, res, next) => {
    const { room, checkInDate, checkOutDate, guests } = req.body
    const user = req.user._id

    const isAvailable = await checkAvailability(room, checkInDate, checkOutDate)
    if (!isAvailable) {
        return next(new ErrorHandler("Room is not available", 404))
    }

    const roomData = await Room.findById(room).populate("hotel")

    let totalPrice = roomData.pricePerNight

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const timeDiff = checkOut.getTime() - checkIn.getTime()
    const numOfNights = Math.ceil(timeDiff / 1000 * 3600 * 24)

    totalPrice *= numOfNights

    const booking = await Booking.create({
        user,
        room,
        hotel: roomData.hotel._id,
        guests: +guests,
        checkInDate,
        checkOutDate,
        totalPrice
    })

    await booking.save();

    await sendEmail({
        email: req.user.email,
        subject: `Hotel Booking Details`,
        html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your booking! Here are your details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount:</strong> $ ${booking.totalPrice}/night</li>
                </ul>
                <p>We look forward to welcome you!</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `
    })

    return res.status(201).json({ success: true, message: "Booking created successfully" })

})


// api to get all bookings of a user

// GET /api/bookings/user

export const getUserBookings = catchAsyncError(async (req, res, next) => {
    const user = req.user._id;

    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 })

    res.status(200).json({ success: true, bookings })
})



// api to get all bookings of a particular hotel

// GET /api/bookings/hotel

export const getHotelBookings = catchAsyncError(async (req, res, next) => {

    const hotel = await Hotel.findOne({ owner: req.auth.userId })

    if (!hotel) {
        return next(new ErrorHandler("No hotel found", 404))
    }

    const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 })
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

    res.status(200).json({ success: true, data: { totalBookings, totalRevenue, bookings } })
})



export const stripePayment = catchAsyncError(async (req, res, next) => {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId)
    const roomData = await Room.findById(booking.room).populate("hotel")
    const totalPrice = booking.totalPrice
    const { origin } = req.headers

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    const line_items = [
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: roomData.hotel.name
                },
                unit_amount: totalPrice * 100
            },
            quantity: 1
        }
    ]


    // create checkout session

    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        metadata: {
            bookingId
        }
    })

    res.status(200).json({ success: true, url: session.url })

})

