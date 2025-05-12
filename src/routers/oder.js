import { Router } from "express";
import {
    cancelOrder,
    createOrder,
    getOrderById,
    getOrders,
    updateOrderStatus,
} from "../controllers/order";
import authMiddleware from "../middleware/auth";

const oderRouter = Router();
 
oderRouter.use(authMiddleware);

oderRouter.get("/", getOrders);
oderRouter.post("/", createOrder);
oderRouter.get("/:id", getOrderById);
oderRouter.put("/:id", updateOrderStatus);
oderRouter.patch("/:id/cancel", cancelOrder);

export default oderRouter;  