import { Router } from "express";
import {
    login,
    register,
    getProfile,
    updateProfile,
} from "../controllers/auth";
import authMiddleware from "../middleware/auth";
import { validateRegister } from "../validators/register";


const authRouter = Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", login);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put("/profile", authMiddleware, updateProfile);
export default authRouter; 