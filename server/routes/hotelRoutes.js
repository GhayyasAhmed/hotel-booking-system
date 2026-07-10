import { Router } from "express";
import {
    deleteHotel,
    getAllHotels,
    getHotelById,
    getMyHotel,
    registerHotel,
    updateHotel
} from "../controllers/hotelController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = Router()


router.get("/", getAllHotels)
router.post("/", isAuthenticatedUser, registerHotel)
router.get("/my-hotel", isAuthenticatedUser, getMyHotel)
router.get("/:id", getHotelById)
router.patch("/:id", isAuthenticatedUser, updateHotel)
router.delete("/:id", isAuthenticatedUser, deleteHotel)

export default router
