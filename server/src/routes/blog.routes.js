const express = require("express");

const blogController = require("../controllers/blog.controller")

const blogRoutes = express.Router();


blogRoutes.get("/" , blogController.readAll);
blogRoutes.get("/:id" , blogController.read);
blogRoutes.post("/" , blogController.create);
blogRoutes.put("/:id" , blogController.update);
blogRoutes.delete("/:id" , blogController.delete);



module.exports = blogRoutes;
