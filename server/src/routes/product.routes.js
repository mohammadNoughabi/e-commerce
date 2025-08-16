const express = require("express");

const productController = require("../controllers/product.controller")

const productRoutes = express.Router();


productRoutes.get("/" , productController.readAll);
productRoutes.get("/:id" , productController.read);
productRoutes.post("/" , productController.create);
productRoutes.put("/:id" , productController.update);
productRoutes.delete("/:id" , productController.delete);

module.exports = productRoutes;
