import { Router } from "express";
import { checkAvailabilityOfRoom, createBooking, getUserBookings, getHotelBookings } from "../controllers/bookingController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = Router()

router.post("/check-availability", checkAvailabilityOfRoom)

router.post("/book",isAuthenticatedUser, createBooking)
router.get("/user",isAuthenticatedUser, getUserBookings)
router.get("/hotel", isAuthenticatedUser, getHotelBookings)

export default router