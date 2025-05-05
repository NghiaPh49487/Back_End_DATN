import { Router } from "express";
import { 
    getAllProduct, 
    getOneProduct, 
    createProduct, 
    updateProduct, 
    removeProduct,
    getProductVariants,
    getVariantBySku
} from "../controllers/product";
import { validateProduct } from "../validators/product";

const productRoute = Router();

productRoute.get("/", getAllProduct);
productRoute.get("/:id", getOneProduct);
productRoute.post("/", validateProduct, createProduct);
productRoute.put("/:id", validateProduct, updateProduct);
productRoute.delete("/:id", removeProduct);
productRoute.get("/:id/variants", getProductVariants);
productRoute.get("/variant/:sku", getVariantBySku);

export default productRoute;