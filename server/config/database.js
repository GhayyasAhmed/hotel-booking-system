import mongoose from "mongoose";

let isConnected = false;

const connectDatabase = async () => {
    console.log("isConnected", isConnected)
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("mongodb is already connected", mongoose.connection.readyState)
        return;
    }

    try {
        console.log("mongoose.connection.readyState try", mongoose.connection.readyState)
        const db = await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log(`mongodb connected with server: ${db.connection.host}`);
    } catch (error) {
        console.log("mongoose.connection.readyState catch", mongoose.connection.readyState)
        isConnected = false;
        console.log("MongoDB connection error:", error.message);
        throw error;
    }
};

export default connectDatabase;