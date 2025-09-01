const express = require("express");

const userController = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

const userRoutes = express.Router();

userRoutes.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  userController.readAll
);
userRoutes.get("/:id", authenticateToken, userController.read);

module.exports = userRoutes;
