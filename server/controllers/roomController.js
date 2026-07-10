import Hotel from "../models/hotelModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorhandler.js"
import {v2 as cloudinary} from "cloudinary"

// api to create a new room for hotel
export const createRoom = catchAsyncError(async (req, res, next) => {
    const {roomType, pricePerNight, amenitites} = req.body
    const hotel = await Hotel.findOne({owner: req.auth.userId})
    if(!hotel){
        return next(new ErrorHandler("No Hotel found", 404))
    }

    // upload images to cloudinary
    const uploadImages = req.files.map(async(file) => {
        const response = await cloudinary.uploader.upload(file.path)
        return response.secure_url
    })

    // wait for all uploads to complete
    const images = await Promise.all(uploadImages)
    
    
    await Room.create({
        hotel: hotel._id,
        roomType,
        pricePerNight: +pricePerNight,
        amenities: JSON.parse(amenitites),
        images
    })

    res.status(201).json({success: true, message: "Room created successfully"})

})


// api to get all rooms
export const getAllRooms = catchAsyncError(async (req, res, next) => {
    const rooms = await Room.find({isAvailable: true}).populate({
        path: 'hotel',
        populate: {path: 'owner', select: 'image'}
    }).sort({createdAt: -1})

    return res.status(200).json({success: true, rooms}) 
})


// api to get all rooms for a specific hotel
export const getOwnerRooms = catchAsyncError(async (req, res, next) => {
    const hotelData = await Hotel.find({owner: req.auth.userId})
    const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel")

    return res.status(200).json({success: true, rooms})
})


// api to change/toggle availability of a rooms
export const toggleRoomAvailability = catchAsyncError(async (req, res, next) => {
    const {roomId} = req.body;
    const roomData = await Room.findById(roomId)

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    
    return res.status(200).json({success: true, message: "Room availability updated"})

})