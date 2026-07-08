import dotenv from "dotenv"
import app from "./app.js"
import connectDatabase from "./config/database.js"


// handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1)
})


//config

dotenv.config({path: "./config/config.env"})

//connecting db
connectDatabase()

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT} port`)
})


// unhandled promise rejection

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection")

    server.close(() => {
        process.exit(1)
    })
})