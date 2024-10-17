// Server/routes/AuthRoutes.js
import { Router } from "express";
import { Signup, Login, getUserInfo, updateProfile, deleteProfileImage, addProfileImage } from "../controller/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer"; 

const upload = multer({ dest: "upload/profile" });  

const authRoutes = Router();

authRoutes.post("/signup", Signup);
authRoutes.post("/login", Login);
authRoutes.get("/userinfo", verifyToken, getUserInfo);  
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/update-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);

export default authRoutes;