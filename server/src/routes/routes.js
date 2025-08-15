const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const blogRoutes = require("./blog.routes");
const productRoutes = require("./product.routes");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Request recieved.");
});

routes.use("/api/auth", authRoutes);
routes.use("/api/user", userRoutes);
routes.use("/api/blog", blogRoutes);
routes.use("/api/category", categoryRoutes);
routes.use("/api/product", productRoutes);

module.exports = routes;
