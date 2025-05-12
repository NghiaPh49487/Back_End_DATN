import { Router } from "express";
import {
    login,
    register,
    getProfile,
    updateProfile,
} from "../controllers/auth";


const authRouter =  Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", getProfile);
authRouter.put("/profile", updateProfile);
export default authRouter;