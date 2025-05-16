import { Router } from "express";
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from "../controllers/brand"
import authMiddleware from "../middleware/auth";
import { validateBrand } from "../validators/brand";

const brandRouter = Router();

brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.post("/", validateBrand, authMiddleware, createBrand);
brandRouter.put("/:id", validateBrand, authMiddleware, updateBrand);
brandRouter.delete("/:id", authMiddleware, deleteBrand);

export default brandRouter;