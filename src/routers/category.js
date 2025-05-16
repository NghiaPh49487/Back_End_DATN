import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category";
import authMiddleware from "../middleware/auth";

const categoryRoute = Router();

categoryRoute.get('/',getAllCategories);
categoryRoute.get('/:id',getCategoryById);
categoryRoute.post('/',authMiddleware, createCategory);
categoryRoute.put('/:id',authMiddleware, updateCategory);
categoryRoute.delete('/:id',authMiddleware, deleteCategory);

export default categoryRoute;