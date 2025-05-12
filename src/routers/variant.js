import { Router } from "express";
import { validateVariant } from '../validators/variant.js';
import { checkDuplicateSKU } from '../middleware/variantMiddleware.js';
import {
    createVariant,
    deleteVariant,
    updateVariant,
    getVariant,
    updateStock,
    getAllVariants
} from "../controllers/variant";
import authMiddleware from "../middleware/auth.js";

 
const variantRouter = Router();

variantRouter.get("/", getAllVariants);
variantRouter.get("/:id", getVariant);
variantRouter.post("/", authMiddleware, validateVariant, checkDuplicateSKU, createVariant);
variantRouter.put("/:id", authMiddleware, validateVariant, checkDuplicateSKU, updateVariant);
variantRouter.delete("/:id", authMiddleware, deleteVariant);
variantRouter.put("/stock/:id", authMiddleware, updateStock);

export default variantRouter;