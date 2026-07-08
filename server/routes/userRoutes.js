import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { getUserData, storeRecentSearchedCitites } from "../controllers/userController.js";

const router = Router()


router.get("/", isAuthenticatedUser, getUserData)
router.post("/store-recent-search", isAuthenticatedUser, storeRecentSearchedCitites)

export default router