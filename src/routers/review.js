import { Router } from "express";
import {
    updateReview,
    deleteReview,
    getProductReviews,
    createReview,
} from "../controllers/review";


const reviewRouter = Router();

reviewRouter.get("/", getProductReviews);
reviewRouter.post("/", createReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;