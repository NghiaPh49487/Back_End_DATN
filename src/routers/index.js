import { Router } from "express";
import productRoute from "./product";
import categoryRoute from "./category";

const router = Router();
router.use('/products',productRoute),
router.use('/categorys',categoryRoute)

export default router;