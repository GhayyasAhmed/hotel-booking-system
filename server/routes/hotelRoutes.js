import { Router } from "express";
import {
    deleteHotel,
    getAllHotels,
    getHotelById,
    getMyHotel,
    registerHotel,
    updateHotel
} from "../controllers/hotelController.js";
import { isAuthenticatedUser, authorizeOwner } from "../middlewares/auth.js";

const router = Router()


router.get("/", getAllHotels)
router.post("/", isAuthenticatedUser, authorizeOwner, registerHotel)
router.get("/my-hotel", isAuthenticatedUser, authorizeOwner, getMyHotel)
router.get("/:id", getHotelById)
router.patch("/:id", isAuthenticatedUser, authorizeOwner, updateHotel)
router.delete("/:id", isAuthenticatedUser, authorizeOwner, deleteHotel)

export default router
