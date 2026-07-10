import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, "Username is required."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    image: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    },
    recentSearchCities: [
        {
            type: String,
            required: true
        }
    ]
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User;
