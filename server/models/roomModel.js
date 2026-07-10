import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({

    hotel: {
        type: String,
        required: true,
        ref: "Hotel"
    },
    roomType: {
        type: String,
        required: [true, "Room type is required."],
        trim: true
    },
    pricePerNight: {
        type: Number,
        required: [true, "Room price per night is required."],
        min: [1, "Room price must be greater than 0."]
    },
    amenities: {
        type: Array,
        default: [],
    },
    images: [
        {
            type: String,
        }
    ],
    isAvailable: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

const Room = mongoose.model("Room", roomSchema)

export default Room;
