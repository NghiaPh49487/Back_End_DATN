import { Router } from "express";
import { getAll, getOne, create, update, remove } from "../controllers/product";
import { validateProduct } from "../validators/product";

const productRoute = Router();

productRoute.get("/products", getAll);
productRoute.get("/products/:id", getOne);
productRoute.post("/products", validateProduct, create);
productRoute.put("/products/:id", validateProduct, update);
productRoute.delete("/products/:id", remove);

export default productRoute;
