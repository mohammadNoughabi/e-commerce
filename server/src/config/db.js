const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
      console.log("MongoDB connection failed");
    });
};

module.exports = connectDB;
