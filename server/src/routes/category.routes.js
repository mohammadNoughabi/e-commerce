const express = require("express");

const categoryController = require("../controllers/category.controller");
const upload = require("../utils/upload");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

const categoryRoutes = express.Router();

categoryRoutes.get("/", categoryController.readAll);
categoryRoutes.get("/:id", categoryController.read);
categoryRoutes.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  categoryController.create
);
categoryRoutes.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("image"),
  categoryController.update
);
categoryRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  categoryController.delete
);

module.exports = categoryRoutes;
