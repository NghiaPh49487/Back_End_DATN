import { Router } from "express";
import productRoute from "./product";

const router = Router();
router.use('/products',productRoute)

export default router;