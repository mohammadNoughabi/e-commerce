const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.get("/validate-token", authController.validateToken);
authRoutes.post("/generate-otp" , authController.generateOTP);
authRoutes.post("/verify-otp" , authController.verifyOTP);
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout" , authController.logout)
authRoutes.post("/forgot-pass", authController.forgotPass);
authRoutes.post("/change-pass", authController.changePass);

module.exports = authRoutes;
