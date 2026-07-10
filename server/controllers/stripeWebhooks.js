import stripe from "stripe";
import Booking from "../models/bookingModel.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

// api to handle stripe webhooks

export const stripeWebhooks = catchAsyncError(async (req, res, next) => {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return next(new ErrorHandler("Stripe webhook is not configured on the server.", 500));
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    if (!sig) {
        return next(new ErrorHandler("Missing Stripe signature header.", 400));
    }

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return next(new ErrorHandler(`Invalid Stripe webhook signature: ${error.message}`, 400));
    }

    // handle the event

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // getting session metadata

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId
        });

        const bookingId = session.data?.[0]?.metadata?.bookingId;

        if (!bookingId) {
            return next(new ErrorHandler("Booking id was not found in Stripe session metadata.", 400));
        }

        // mark payment as paid
        await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe" }, { runValidators: true });



    }

    else {
        return res.status(200).json({ received: true, message: `Unhandled event type: ${event.type}` });
    }

    res.status(200).json({ received: true });
});
