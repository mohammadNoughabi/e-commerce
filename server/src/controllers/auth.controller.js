const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
require("dotenv").config();

exports.getExistingUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: decoded.userId, userRole: decoded.userRole });
  } catch (error) {
    res.clearCookie('token')
    res.status(401).json({ message: "Invalid or Expired token" });
  }
};

exports.register = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists. Choose another Email." });
    }
    let hashedPass = await bcrypt.hash(password, 10);
    let newUser = new User({
      email,
      password: hashedPass,
    });
    await newUser.save();
    let token = jwt.sign(
      { userId: newUser._id, userRole: "reqular" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .json({ message: "user created successfully.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required." });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    let passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    let token = jwt.sign(
      { userId: user._id, userRole: "reqular" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    
    return res.status(200).json({ message: "Login successfull.", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.forgotPass = async (req, res) => {};

exports.changePass = async (req, res) => {};
