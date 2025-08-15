const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.get("/validate-token", authController.validateToken);
authRoutes.post("/send-otp" , authController.sendOTP);
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout" , authController.logout)
authRoutes.post("/forgot-pass", authController.forgotPass);
authRoutes.post("/change-pass", authController.changePass);

module.exports = authRoutes;
