import { Router } from "express";
import{
    addToCart, 
    getCart, 
    removeFromCart,
    updateCartItem, 

} from "../controllers/cart";
import authMiddleware from "../middleware/auth";


const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.delete("/", removeFromCart);
cartRouter.put("/:itemId", updateCartItem);

export default cartRouter;