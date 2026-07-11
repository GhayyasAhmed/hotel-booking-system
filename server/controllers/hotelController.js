import Booking from "../models/bookingModel.js";
import Hotel from "../models/hotelModel.js";
import Review from "../models/reviewModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

const validateHotelPayload = ({ name, address, contact, city }) => {
    if (!name?.trim()) throw new ErrorHandler("Hotel name is required.", 400);
    if (!address?.trim()) throw new ErrorHandler("Hotel address is required.", 400);
    if (!contact?.trim()) throw new ErrorHandler("Hotel contact is required.", 400);
    if (!city?.trim()) throw new ErrorHandler("Hotel city is required.", 400);
};

const ensureHotelOwner = (hotel, userId) => {
    if (!hotel) {
        throw new ErrorHandler("Hotel not found.", 404);
    }

    if (hotel.owner.toString() !== userId) {
        throw new ErrorHandler("You can only manage your own hotel.", 403);
    }
};

export const registerHotel = catchAsyncError(async (req, res, next) => {
    validateHotelPayload(req.body);

    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
        return next(new ErrorHandler("You have already registered a hotel.", 409));
    }

    const hotel = await Hotel.create({
        name: name.trim(),
        address: address.trim(),
        contact: contact.trim(),
        city: city.trim(),
        owner
    });

    await User.findByIdAndUpdate(owner, { role: "owner" }, { runValidators: true });

    return res.status(201).json({
        success: true,
        message: "Hotel registered successfully.",
        hotel
    });
});

export const getAllHotels = catchAsyncError(async (req, res) => {
    const filter = {};
    if (req.query.city) filter.city = new RegExp(req.query.city, "i");

    const hotels = await Hotel.find(filter)
        .populate("owner", "username image")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: hotels.length, hotels });
});

export const getMyHotel = catchAsyncError(async (req, res, next) => {
    const hotel = await Hotel.findOne({ owner: req.user._id }).populate("owner", "username image");

    if (!hotel) {
        return next(new ErrorHandler("No hotel found for this user.", 404));
    }

    res.status(200).json({ success: true, hotel });
});

export const getHotelById = catchAsyncError(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id).populate("owner", "username image");

    if (!hotel) {
        return next(new ErrorHandler("Hotel not found.", 404));
    }

    res.status(200).json({ success: true, hotel });
});

export const updateHotel = catchAsyncError(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id);
    ensureHotelOwner(hotel, req.user._id);

    const updates = {};
    ["name", "address", "contact", "city"].forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field]?.trim();
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("Please provide at least one hotel field to update.", 400));
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Hotel updated successfully.",
        hotel: updatedHotel
    });
});

export const deleteHotel = catchAsyncError(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id);
    ensureHotelOwner(hotel, req.user._id);

    const rooms = await Room.find({ hotel: hotel._id });
    const roomIds = rooms.map((room) => room._id.toString());

    await Review.deleteMany({ hotel: hotel._id });
    await Booking.deleteMany({ hotel: hotel._id });
    await Room.deleteMany({ _id: { $in: roomIds } });
    await Hotel.findByIdAndDelete(hotel._id);
    // await User.findByIdAndUpdate(req.user._id, { role: "user" }, { runValidators: true });

    res.status(200).json({ success: true, message: "Hotel deleted successfully." });
});
