import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            ref: "User",
            required: true
        },
        hotel: {
            type: String,
            ref: "Hotel",
            required: true
        },
        room: {
            type: String,
            ref: "Room",
            required: true
        },
        booking: {
            type: String,
            ref: "Booking",
            required: true,
            unique: true
        },
        rating: {
            type: Number,
            required: [true, "Rating is required."],
            min: [1, "Rating must be at least 1."],
            max: [5, "Rating cannot be greater than 5."]
        },
        title: {
            type: String,
            trim: true,
            maxlength: [80, "Review title cannot exceed 80 characters."]
        },
        comment: {
            type: String,
            required: [true, "Review comment is required."],
            trim: true,
            maxlength: [1000, "Review comment cannot exceed 1000 characters."]
        }
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
