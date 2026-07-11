import Booking from "../models/bookingModel.js";
import Hotel from "../models/hotelModel.js";
import Review from "../models/reviewModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

const pickUserFields = (body) => {
    const updates = {};

    if (body.username !== undefined) updates.username = body.username?.trim();
    if (body.email !== undefined) updates.email = body.email?.trim().toLowerCase();
    if (body.image !== undefined) updates.image = body.image;

    return updates;
};

export const syncUser = catchAsyncError(async (req, res, next) => {
    const { username, email, image } = req.body;

    if (!username?.trim()) {
        return next(new ErrorHandler("Username is required.", 400));
    }

    if (!email?.trim()) {
        return next(new ErrorHandler("Email is required.", 400));
    }

    const existingUser = await User.findById(req.userId);
    const user = await User.findByIdAndUpdate(
        req.userId,
        {
            username: username.trim(),
            email: email.trim().toLowerCase(),
            image: image || ""
        },
        {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    );

    res.status(existingUser ? 200 : 201).json({
        success: true,
        message: existingUser ? "User synced successfully." : "User created successfully.",
        user
    });
});

export const getUserData = catchAsyncError(async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export const getAllUsers = catchAsyncError(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
    if (req.user.role !== "owner" && req.params.id !== req.user._id) {
        return next(new ErrorHandler("You can only view your own profile.", 403));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    res.status(200).json({ success: true, user });
});

export const updateCurrentUser = catchAsyncError(async (req, res, next) => {
    const updates = pickUserFields(req.body);

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("Please provide at least one profile field to update.", 400));
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, message: "User updated successfully.", user });
});

export const deleteCurrentUser = catchAsyncError(async (req, res) => {
    const hotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = hotels.map((hotel) => hotel._id.toString());

    if (hotelIds.length > 0) {
        await Review.deleteMany({ hotel: { $in: hotelIds } });
        await Booking.deleteMany({ hotel: { $in: hotelIds } });
        await Room.deleteMany({ hotel: { $in: hotelIds } });
        await Hotel.deleteMany({ _id: { $in: hotelIds } });
    }

    await Review.deleteMany({ user: req.user._id });
    await Booking.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ success: true, message: "User deleted successfully." });
});

export const storeRecentSearchedCities = catchAsyncError(async (req, res, next) => {
    const { recentSearchedCity } = req.body;

    if (!recentSearchedCity?.trim()) {
        return next(new ErrorHandler("Recent searched city is required.", 400));
    }

    req.user.recentSearchCities = req.user.recentSearchCities.filter(
        (city) => city.toLowerCase() !== recentSearchedCity.trim().toLowerCase()
    );
    req.user.recentSearchCities.push(recentSearchedCity.trim());
    req.user.recentSearchCities = req.user.recentSearchCities.slice(-3);

    await req.user.save();

    res.status(200).json({
        success: true,
        message: "City added successfully.",
        recentSearchCities: req.user.recentSearchCities
    });
});
