import { Router } from "express";
import {
    createReview,
    deleteReview,
    getAllReviews,
    getMyReviews,
    getReviewById,
    updateReview
} from "../controllers/reviewController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = Router();

router.post("/", isAuthenticatedUser, createReview);
router.get("/", getAllReviews);
router.get("/my-reviews", isAuthenticatedUser, getMyReviews);
router.get("/:id", getReviewById);
router.patch("/:id", isAuthenticatedUser, updateReview);
router.delete("/:id", isAuthenticatedUser, deleteReview);

export default router;
