const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const generateOtp = require("../utils/generateOTP");
require("dotenv").config();

exports.validateToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ userId: decoded.userId, userRole: decoded.userRole });
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    let otp = generateOtp(6);
    let email = req.body.email;
    let title = "Your Verification Code";
    let html = ` <p>please enter this code to complete authentication :</p>
      <h2>${otp}</h2>`;

    sendMail(email, title, html);
    return res.status(200).json({ otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in sending OTP." });
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
      { userId: newUser._id, userRole: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
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
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successfull.", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPass = async (req, res) => {};

exports.changePass = async (req, res) => {};
