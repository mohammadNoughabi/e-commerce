const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.get("/get-existing-user", authController.getExistingUser);
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/forgot-pass", authController.forgotPass);
authRoutes.post("/change-pass", authController.changePass);

module.exports = authRoutes;
