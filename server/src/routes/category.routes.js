const express = require("express");

const categoryController = require("../controllers/category.controller");
const upload = require("../utils/upload");

const categoryRoutes = express.Router();

categoryRoutes.get("/", categoryController.readAll);
categoryRoutes.get("/:id", categoryController.read);
categoryRoutes.post("/", upload.single("image"), categoryController.create);
categoryRoutes.put("/:id", upload.single("image"), categoryController.update);
categoryRoutes.delete("/:id", categoryController.delete);

module.exports = categoryRoutes;
