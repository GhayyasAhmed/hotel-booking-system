import { Router } from "express";
import { isAuthenticatedUser, requireClerkAuth, authorizeRoles } from "../middlewares/auth.js";
import {
    deleteCurrentUser,
    getAllUsers,
    getUserById,
    getUserData,
    storeRecentSearchedCities,
    syncUser,
    updateCurrentUser,
    updateRole
} from "../controllers/userController.js";

const router = Router()


router.post("/sync", requireClerkAuth, syncUser)
router.get("/", isAuthenticatedUser, getUserData)
router.patch("/", isAuthenticatedUser, updateCurrentUser)
router.delete("/", isAuthenticatedUser, deleteCurrentUser)
router.get("/all", isAuthenticatedUser, authorizeRoles("owner"), getAllUsers)
router.patch("/role/:role", isAuthenticatedUser, updateRole);
router.post("/store-recent-search", isAuthenticatedUser, storeRecentSearchedCities)
router.get("/:id", isAuthenticatedUser, getUserById)

export default router
