import Booking from "../models/bookingModel.js";
import Hotel from "../models/hotelModel.js";
import Review from "../models/reviewModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

import { Webhook } from "svix";

const clerkWebhooks = catchAsyncError(async (req, res, next) => {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
        return next(new ErrorHandler("Clerk webhook secret is not configured.", 500));
    }

    const headers = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
    };

    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
        return next(new ErrorHandler("Missing Clerk webhook signature headers.", 400));
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    if (!data || !type) {
        return next(new ErrorHandler("Invalid Clerk webhook payload.", 400));
    }

    switch (type) {
        case "user.created": {

            const userData = {
                email: data.email_addresses?.[0]?.email_address,
                username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "User",
                image: data.image_url || ""
            };
            await User.findByIdAndUpdate(data.id, userData, {
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            });
            break;
        }
        case "user.updated": {

            const userData = {
                email: data.email_addresses?.[0]?.email_address,
                username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "User",
                image: data.image_url || ""
            };
            await User.findByIdAndUpdate(data.id, userData, {
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            });
            break;
        }
        case "user.deleted": {
            const hotels = await Hotel.find({ owner: data.id });
            const hotelIds = hotels.map((hotel) => hotel._id.toString());

            if (hotelIds.length > 0) {
                await Review.deleteMany({ hotel: { $in: hotelIds } });
                await Booking.deleteMany({ hotel: { $in: hotelIds } });
                await Room.deleteMany({ hotel: { $in: hotelIds } });
                await Hotel.deleteMany({ _id: { $in: hotelIds } });
            }

            await Review.deleteMany({ user: data.id });
            await Booking.deleteMany({ user: data.id });
            await User.findByIdAndDelete(data.id);
            break;
        }
        default:
            break;
    }

    res.status(200).json({ success: true, message: "Webhook received." });
});

export default clerkWebhooks
