import { Router } from "express";
import productRoute from "./product";
import categoryRoute from "./category";
import stockRouter from "./stock";
import brandRouter from "./brand";
import variantRouter from "./variant";
import cartRouter from "./cart";
import oderRouter from "./oder";
import reviewRouter from "./review";
import authRouter from "./auth";

const router = Router();

router.use('/products', productRoute);
router.use('/category', categoryRoute);
router.use('/stocks', stockRouter);
router.use('/brands', brandRouter);
router.use('/variants', variantRouter);
router.use('/carts', cartRouter);
router.use('/orders', oderRouter);
router.use('/reviews', reviewRouter);
router.use('/auth', authRouter);
export default router;