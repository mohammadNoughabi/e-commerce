const express = require("express");

const userController = require("../controllers/user.controller");

const userRoutes = express.Router();

userRoutes.get("/", userController.readAll);
userRoutes.get("/:id", userController.read);

module.exports = userRoutes;
