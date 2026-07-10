import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

const validateReviewInput = ({ rating, comment }) => {
    if (rating === undefined || Number(rating) < 1 || Number(rating) > 5) {
        throw new ErrorHandler("Rating must be between 1 and 5.", 400);
    }

    if (!comment?.trim()) {
        throw new ErrorHandler("Review comment is required.", 400);
    }
};

const getReviewForAccess = async (reviewId, userId) => {
    const review = await Review.findById(reviewId).populate("user hotel room booking");

    if (!review) {
        throw new ErrorHandler("Review not found.", 404);
    }

    const isReviewOwner = review.user?._id?.toString() === userId || review.user?.toString() === userId;
    const isHotelOwner = review.hotel?.owner?.toString() === userId;

    if (!isReviewOwner && !isHotelOwner) {
        throw new ErrorHandler("You can only manage reviews connected to your account or hotel.", 403);
    }

    return { review, isReviewOwner, isHotelOwner };
};

export const createReview = catchAsyncError(async (req, res, next) => {
    const { booking: bookingId, rating, title, comment } = req.body;

    if (!bookingId) {
        return next(new ErrorHandler("Booking id is required.", 400));
    }

    validateReviewInput({ rating, comment });

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return next(new ErrorHandler("Booking not found.", 404));
    }

    if (booking.user.toString() !== req.user._id) {
        return next(new ErrorHandler("You can only review your own bookings.", 403));
    }

    if (booking.status === "cancelled") {
        return next(new ErrorHandler("Cancelled bookings cannot be reviewed.", 409));
    }

    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
        return next(new ErrorHandler("This booking has already been reviewed.", 409));
    }

    const review = await Review.create({
        user: req.user._id,
        hotel: booking.hotel,
        room: booking.room,
        booking: booking._id,
        rating: Number(rating),
        title: title?.trim(),
        comment: comment.trim()
    });

    res.status(201).json({ success: true, message: "Review created successfully.", review });
});

export const getAllReviews = catchAsyncError(async (req, res) => {
    const filter = {};

    if (req.query.hotel) filter.hotel = req.query.hotel;
    if (req.query.room) filter.room = req.query.room;
    if (req.query.user) filter.user = req.query.user;

    const reviews = await Review.find(filter)
        .populate("user", "username image")
        .populate("hotel", "name city")
        .populate("room", "roomType images pricePerNight")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
});

export const getMyReviews = catchAsyncError(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate("hotel", "name city")
        .populate("room", "roomType images pricePerNight")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
});

export const getReviewById = catchAsyncError(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
        .populate("user", "username image")
        .populate("hotel", "name city")
        .populate("room", "roomType images pricePerNight")
        .populate("booking");

    if (!review) {
        return next(new ErrorHandler("Review not found.", 404));
    }

    res.status(200).json({ success: true, review });
});

export const updateReview = catchAsyncError(async (req, res, next) => {
    const { review, isReviewOwner } = await getReviewForAccess(req.params.id, req.user._id);

    if (!isReviewOwner) {
        return next(new ErrorHandler("Only the review owner can update this review.", 403));
    }

    const updates = {};

    if (req.body.rating !== undefined) {
        if (Number(req.body.rating) < 1 || Number(req.body.rating) > 5) {
            return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
        }
        updates.rating = Number(req.body.rating);
    }

    if (req.body.title !== undefined) updates.title = req.body.title?.trim();
    if (req.body.comment !== undefined) {
        if (!req.body.comment?.trim()) {
            return next(new ErrorHandler("Review comment cannot be empty.", 400));
        }
        updates.comment = req.body.comment.trim();
    }

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("Please provide at least one review field to update.", 400));
    }

    const updatedReview = await Review.findByIdAndUpdate(review._id, updates, {
        new: true,
        runValidators: true
    })
        .populate("user", "username image")
        .populate("hotel", "name city")
        .populate("room", "roomType images pricePerNight");

    res.status(200).json({
        success: true,
        message: "Review updated successfully.",
        review: updatedReview
    });
});

export const deleteReview = catchAsyncError(async (req, res) => {
    const { review } = await getReviewForAccess(req.params.id, req.user._id);

    await Review.findByIdAndDelete(review._id);

    res.status(200).json({ success: true, message: "Review deleted successfully." });
});
