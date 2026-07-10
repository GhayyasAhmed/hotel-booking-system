import { Router } from "express";
import {
    cancelBooking,
    checkAvailabilityOfRoom,
    createBooking,
    deleteBooking,
    getBookingById,
    getHotelBookings,
    getUserBookings,
    stripePayment,
    updateBooking,
    updateBookingStatus
} from "../controllers/bookingController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = Router()

router.post("/check-availability", checkAvailabilityOfRoom)
router.post("/book", isAuthenticatedUser, createBooking)
router.get("/user", isAuthenticatedUser, getUserBookings)
router.get("/hotel", isAuthenticatedUser, getHotelBookings)
router.post("/stripe-payment", isAuthenticatedUser, stripePayment)
router.get("/:id", isAuthenticatedUser, getBookingById)
router.patch("/:id", isAuthenticatedUser, updateBooking)
router.patch("/:id/status", isAuthenticatedUser, updateBookingStatus)
router.patch("/:id/cancel", isAuthenticatedUser, cancelBooking)
router.delete("/:id", isAuthenticatedUser, deleteBooking)

export default router
