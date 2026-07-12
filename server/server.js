import dotenv from "dotenv"
import app from "./app.js"
import connectDatabase from "./config/database.js"
import connectCloudinary from "./config/cloudinary.js"


// handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1)
})


//config

dotenv.config({path: "./config/config.env"})

//connecting db
// connectDatabase()

// Ensure DB is connected on every request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Database connection failed." 
    });
  }
});

connectCloudinary()


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT} port`)
})


app.get("/debug-env", (req, res) => {
  res.json({
    hasDb: !!process.env.DB_URI,
    hasClerk: !!process.env.CLERK_SECRET_KEY,
    hasStripe: !!process.env.STRIPE_SECRET_KEY,
    nodeEnv: process.env.NODE_ENV,
    dbState: mongoose.connection.readyState,
    Db: process.env.DB_URI,
    Clerk: process.env.CLERK_SECRET_KEY,
    Stripe: process.env.STRIPE_SECRET_KEY
  });
});

// unhandled promise rejection

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection")

    server.close(() => {
        process.exit(1)
    })
})