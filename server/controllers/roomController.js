import Booking from "../models/bookingModel.js";
import Hotel from "../models/hotelModel.js";
import Review from "../models/reviewModel.js";
import Room from "../models/roomModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";
import { v2 as cloudinary } from "cloudinary";

const parseAmenities = (amenitiesValue) => {
    if (amenitiesValue === undefined) return undefined;
    if (Array.isArray(amenitiesValue)) return amenitiesValue;

    let parsedAmenities;
    try {
        parsedAmenities = JSON.parse(amenitiesValue);
    } catch {
        throw new ErrorHandler("Amenities must be a valid JSON array.", 400);
    }

    if (!Array.isArray(parsedAmenities)) {
        throw new ErrorHandler("Amenities must be an array.", 400);
    }

    return parsedAmenities;
};

const uploadRoomImages = async (files = []) => {
    const uploadImages = files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
    });

    return Promise.all(uploadImages);
};

const findOwnerHotel = async (userId) => {
    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
        throw new ErrorHandler("Please register a hotel before managing rooms.", 404);
    }

    return hotel;
};

const ensureRoomOwner = async (roomId, userId) => {
    const room = await Room.findById(roomId).populate("hotel");

    if (!room) {
        throw new ErrorHandler("Room not found.", 404);
    }

    if (!room.hotel || room.hotel.owner.toString() !== userId) {
        throw new ErrorHandler("You can only manage rooms for your own hotel.", 403);
    }

    return room;
};

export const createRoom = catchAsyncError(async (req, res, next) => {
    const { roomType, pricePerNight } = req.body;
    const amenities = parseAmenities(req.body.amenities ?? req.body.amenitites);

    if (!roomType?.trim()) {
        return next(new ErrorHandler("Room type is required.", 400));
    }

    if (!pricePerNight || Number(pricePerNight) <= 0) {
        return next(new ErrorHandler("Room price per night must be greater than 0.", 400));
    }

    const hotel = await findOwnerHotel(req.user._id);

    const images = await uploadRoomImages(req.files);

    const room = await Room.create({
        hotel: hotel._id,
        roomType: roomType.trim(),
        pricePerNight: Number(pricePerNight),
        amenities: amenities || [],
        images
    });

    res.status(201).json({ success: true, message: "Room created successfully.", room });
});

export const getAllRooms = catchAsyncError(async (req, res) => {
    const filter = {};

    if (req.query.hotel) filter.hotel = req.query.hotel;
    if (req.query.includeUnavailable !== "true") filter.isAvailable = true;

    const rooms = await Room.find(filter)
        .populate({
            path: "hotel",
            populate: { path: "owner", select: "username image" }
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: rooms.length, rooms });
});

export const getRoomById = catchAsyncError(async (req, res, next) => {
    const room = await Room.findById(req.params.id).populate({
        path: "hotel",
        populate: { path: "owner", select: "username image" }
    });

    if (!room) {
        return next(new ErrorHandler("Room not found.", 404));
    }

    res.status(200).json({ success: true, room });
});

export const getOwnerRooms = catchAsyncError(async (req, res, next) => {
    const hotel = await findOwnerHotel(req.user._id);

    const rooms = await Room.find({ hotel: hotel._id }).populate("hotel").sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: rooms.length, rooms });
});

export const updateRoom = catchAsyncError(async (req, res, next) => {
    const room = await ensureRoomOwner(req.params.id, req.user._id);

    const updates = {};
    const amenities = parseAmenities(req.body.amenities ?? req.body.amenitites);

    if (req.body.roomType !== undefined) updates.roomType = req.body.roomType?.trim();
    if (req.body.pricePerNight !== undefined) {
        if (Number(req.body.pricePerNight) <= 0) {
            return next(new ErrorHandler("Room price per night must be greater than 0.", 400));
        }
        updates.pricePerNight = Number(req.body.pricePerNight);
    }
    if (amenities !== undefined) updates.amenities = amenities;
    if (req.body.isAvailable !== undefined) updates.isAvailable = req.body.isAvailable;
    if (req.files?.length) updates.images = await uploadRoomImages(req.files);

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("Please provide at least one room field to update.", 400));
    }

    const updatedRoom = await Room.findByIdAndUpdate(room._id, updates, {
        new: true,
        runValidators: true
    }).populate("hotel");

    return res.status(200).json({
        success: true,
        message: "Room updated successfully.",
        room: updatedRoom
    });
});

export const deleteRoom = catchAsyncError(async (req, res, next) => {
    const room = await ensureRoomOwner(req.params.id, req.user._id);

    await Review.deleteMany({ room: room._id });
    await Booking.deleteMany({ room: room._id });
    await Room.findByIdAndDelete(room._id);

    return res.status(200).json({ success: true, message: "Room deleted successfully." });
});

export const toggleRoomAvailability = catchAsyncError(async (req, res, next) => {
    const roomId = req.params.id || req.body.roomId;

    if (!roomId) {
        return next(new ErrorHandler("Room id is required.", 400));
    }

    const room = await ensureRoomOwner(roomId, req.user._id);

    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.status(200).json({
        success: true,
        message: "Room availability updated successfully.",
        room
    });
});
