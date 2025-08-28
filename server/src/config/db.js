const mongoose = require("mongoose");
require("dotenv").config();
const createDefaultCategory = require("../seeders/createDefaultCategory");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(async () => {
      console.log("MongoDB connected successfully.");
      await createDefaultCategory();
    })
    .catch((error) => {
      console.log("MongoDB connection failed");
    });
};

module.exports = connectDB;
