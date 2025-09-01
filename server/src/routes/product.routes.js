const express = require("express");

const productController = require("../controllers/product.controller");
const upload = require("../utils/upload");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRole = require("../middlewares/authorizeRole");

const productRoutes = express.Router();

productRoutes.get("/", productController.readAll);
productRoutes.get("/:id", productController.read);
productRoutes.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]),
  productController.create
);
productRoutes.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]),
  productController.update
);
productRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  productController.delete
);

module.exports = productRoutes;
