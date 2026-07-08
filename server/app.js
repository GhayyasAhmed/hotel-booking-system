import express from "express"
import cors from "cors"
import errorMiddleware from "./middlewares/error.js"

const app = express()

app.use(cors())
app.use(express.json());

app.get("/", (req,res) => {
    return res.send("Api is working")
})


// Middleware for Errors

app.use(errorMiddleware)

export default app