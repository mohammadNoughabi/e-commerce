const express = require("express");

const searchRoutes = express.Router();

const searchController = require("../controllers/search.controller");

searchRoutes.get("/", searchController.search);

module.exports = searchRoutes;
