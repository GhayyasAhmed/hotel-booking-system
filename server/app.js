import express from "express"
import cors from "cors"
import errorMiddleware from "./middlewares/error.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import roomRouter from "./routes/roomRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import { stripeWebhooks } from "./controllers/stripeWebhooks.js"

const app = express()

app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())

// api to listen to stripe webhook
app.post("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks);

// api to listen to clerk webhook

app.use("/api/clerk", clerkWebhooks);

app.get("/", (req,res) => {
    return res.send("Api is working")
})


app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/booking", bookingRouter);


// Middleware for Errors

app.use(errorMiddleware)

export default app