import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    user: {
        type: String,
        ref: "User",
        required: true
    },
    room: {
        type: String,
        ref: "Room",
        required: true
    },
    hotel: {
        type: String,
        ref: "Hotel",
        required: true
    },
    checkInDate: {
        type: Date,
        required: [true, "Check-in date is required."],
    },
     checkOutDate: {
        type: Date,
        required: [true, "Check-out date is required."],
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required."],
        min: [1, "Total price must be greater than 0."]
    },
    guests: {
        type: Number,
        required: [true, "Number of guests is required."],
        min: [1, "At least one guest is required."]
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "pay at hotel"
    },
    isPaid: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking;
