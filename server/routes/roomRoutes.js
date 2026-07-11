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
import { isAuthenticatedUser, authorizeOwner } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router()

router.post("/", isAuthenticatedUser, authorizeOwner, upload.array("images", 4), createRoom)
router.get("/", getAllRooms)
router.get("/owner", isAuthenticatedUser,authorizeOwner, getOwnerRooms)
router.get("/:id", getRoomById)
router.patch("/:id/toggle-availability", isAuthenticatedUser,authorizeOwner, toggleRoomAvailability)
router.patch("/:id", isAuthenticatedUser,authorizeOwner, upload.array("images", 4), updateRoom)
router.delete("/:id", isAuthenticatedUser,authorizeOwner, deleteRoom)

export default router
