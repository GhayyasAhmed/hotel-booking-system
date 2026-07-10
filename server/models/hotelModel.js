import mongoose from "mongoose";



const hotelSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Hotel name is required."],
        trim: true
    },
    address: {
        type: String,
        required: [true, "Hotel address is required."],
        trim: true
    },
    contact: {
        type: String,
        required: [true, "Hotel contact is required."],
        trim: true
    },
    owner: {
        type: String,
        required: true,
        ref: "User"
    },
    city: {
        type: String,
        required: [true, "Hotel city is required."],
        trim: true
    }
},
    {
        timestamps: true
    }
)

const Hotel = mongoose.model("Hotel", hotelSchema)

export default Hotel;
