const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const searchRoutes = require("./search.routes");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Request recieved.");
});

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/category", categoryRoutes);
routes.use("/product", productRoutes);
routes.use("/search", searchRoutes);

module.exports = routes;
