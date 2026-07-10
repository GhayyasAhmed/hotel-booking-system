import { Router } from "express";
import { registerHotel } from "../controllers/hotelController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = Router()


// router.get("/", isAuthenticatedUser, getUserData)
router.post("/", isAuthenticatedUser, registerHotel)

export default router