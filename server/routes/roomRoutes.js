import { Router } from "express";
import {
    createRoom,
    deleteRoom,
    getAllRooms,
    getOwnerRooms,
    getRoomById,
    toggleRoomAvailability,
    updateRoom
} from "../controllers/roomController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router()

router.post("/", isAuthenticatedUser, upload.array("images", 4), createRoom)
router.get("/", getAllRooms)
router.get("/owner", isAuthenticatedUser, getOwnerRooms)
router.get("/:id", getRoomById)
router.patch("/toggle-availability", isAuthenticatedUser, toggleRoomAvailability)
router.patch("/:id/toggle-availability", isAuthenticatedUser, toggleRoomAvailability)
router.patch("/:id", isAuthenticatedUser, upload.array("images", 4), updateRoom)
router.delete("/:id", isAuthenticatedUser, deleteRoom)

export default router
