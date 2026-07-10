import { Router } from "express";
import { createRoom, getAllRooms, getOwnerRooms, toggleRoomAvailability } from "../controllers/roomController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router()

router.post("/", upload.array("images", 4), isAuthenticatedUser, createRoom)
router.get("/", getAllRooms)
router.get("/owner", isAuthenticatedUser, getOwnerRooms)
router.patch("/toggle-availability",isAuthenticatedUser,  toggleRoomAvailability)

export default router