// Server/routes/AuthRoutes.js
import { Router } from "express";
import { Signup, Login, getUserInfo } from "../controller/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", Signup);
authRoutes.post("/login", Login);
authRoutes.get("/userinfo", verifyToken, getUserInfo);  

export default authRoutes;