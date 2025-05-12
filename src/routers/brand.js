import { Router } from "express";
import {
    createBrand, 
    deleteBrand, 
    getAllBrands, 
    getBrandById, 
    updateBrand 
} from "../controllers/brand"



const brandRouter = Router();

brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.post("/", createBrand);
brandRouter.put("/:id", updateBrand);
brandRouter.delete("/:id", deleteBrand);

export default brandRouter;