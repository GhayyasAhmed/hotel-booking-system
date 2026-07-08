import express from "express"
import cors from "cors"
import errorMiddleware from "./middlewares/error.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"

const app = express()


app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())


// api to listen to clerk webhook

app.use("/api/clerk", clerkWebhooks);

app.get("/", (req,res) => {
    return res.send("Api is working")
})


app.use("/api/user", userRouter);

// Middleware for Errors

app.use(errorMiddleware)

export default app