import Hotel from "../models/hotelModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorhandler.js"

export const registerHotel = catchAsyncError(async (req, res, next) => {
    const {name, address, contact, city} = req.body;
    const owner = req.user._id

    // check if user already registered
    const hotel = await Hotel.findOne({owner})
    if(hotel){
        return res.json({success: false, message: "Hotel already registered"})

    }
    await Hotel.create({name, address, contact, city, owner})
    await User.findByIdAndDelete(owner, {role: "owner"})

    return res.status(201).json({success: true, message: "Hotel registered successfully"})
})