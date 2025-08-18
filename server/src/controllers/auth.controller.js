const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const generateOtp = require("../utils/generateOTP");
require("dotenv").config();

// -------------------- Validate Token --------------------
exports.validateToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ userId: null, userRole: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ userId: decoded.userId, userRole: decoded.userRole });
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
};

// -------------------- Send OTP --------------------
exports.generateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate random OTP
    const otp = generateOtp(6);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    let title = "Complete Your Registration - Verification Code";
    let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Our Platform!</h2>
          <p>Please use the following verification code to complete your registration:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; letter-spacing: 3px;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `;

    // Send email
    await sendMail({
      receiver: email,
      title,
      htmlContent: html,
    });

    // Save OTP in session
    req.session.otpData = {
      otp,
      email,
      otpExpiry,
    };

    return res.status(200).json({
      message: `Code sent to ${email} successfully`,
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({
      message: "Error in sending OTP",
      error: error.message,
    });
  }
};

// -------------------- Verify OTP --------------------
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email, OTP are required" });
    }

    // Check session
    if (!req.session.otpData) {
      return res.status(400).json({ message: "No OTP session found" });
    }

    const {
      otp: sessionOtp,
      email: sessionEmail,
      otpExpiry,
    } = req.session.otpData;

    // Validate OTP
    if (sessionEmail !== email) {
      return res.status(400).json({ message: "Email does not match" });
    }

    if (Date.now() > otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (sessionOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid - clear session
    req.session.otpData = null;

    return res.status(200).json({
      message: "OTP verified successfully",
      email,
      verified: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// -------------------- Register --------------------
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please login instead.",
      });
    }

    // Hash password and create user
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPass,
    });

    await newUser.save();

    // Generate token for immediate login after registration
    const token = jwt.sign(
      { userId: newUser._id, userRole: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Registration successful",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// -------------------- Login --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// -------------------- Logout --------------------
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// -------------------- Forgot / Change Password --------------------
exports.forgotPass = async (req, res) => {
  return res.status(501).json({ message: "Not implemented yet" });
};

exports.changePass = async (req, res) => {
  return res.status(501).json({ message: "Not implemented yet" });
};
