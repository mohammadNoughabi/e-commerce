const express = require("express");

const productController = require("../controllers/product.controller");
const upload = require("../utils/upload");

const productRoutes = express.Router();

productRoutes.get("/", productController.readAll);
productRoutes.get("/:id", productController.read);
productRoutes.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]),
  productController.create
);
productRoutes.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]),
  productController.update
);
productRoutes.delete("/:id", productController.delete);

module.exports = productRoutes;
