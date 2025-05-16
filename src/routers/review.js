import { Router } from "express";
import {
    updateReview,
    deleteReview,
    getProductReviews,
    createReview,
} from "../controllers/review";
import authMiddleware from "../middleware/auth";
import { validateReview } from "../validators/review";


const reviewRouter = Router();
reviewRouter.use(validateReview)

reviewRouter.get("/", getProductReviews);
reviewRouter.post("/", authMiddleware, createReview);
reviewRouter.put("/:id", authMiddleware, updateReview);
reviewRouter.delete("/:id", authMiddleware, deleteReview);

export default reviewRouter;