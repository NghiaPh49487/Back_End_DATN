import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category";

const categoryRoute = Router();

categoryRoute.get('/',getAllCategories);
categoryRoute.get('/:id',getCategoryById);
categoryRoute.post('/',createCategory);
categoryRoute.put('/:id',updateCategory);
categoryRoute.delete('/:id',deleteCategory);

export default categoryRoute;