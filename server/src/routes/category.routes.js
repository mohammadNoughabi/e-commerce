const express = require("express");

const categoryController = require("../controllers/category.controller")

const categoryRoutes = express.Router();

categoryRoutes.get("/" , categoryController.readAll);
categoryRoutes.get("/:id" , categoryController.read);
categoryRoutes.post("/" , categoryController.create);
categoryRoutes.put("/:id" , categoryController.update);
categoryRoutes.delete("/:id" , categoryController.delete);

module.exports = categoryRoutes;
