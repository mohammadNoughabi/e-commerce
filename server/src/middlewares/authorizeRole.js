const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1️⃣ Get token (first from cookies, fallback to Authorization header)
      let token = req.cookies?.token;

      if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      // 2️⃣ No token → unauthorized
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized! No token provided." });
      }

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Check user role
      if (!allowedRoles.includes(decoded.userRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden! Insufficient role." });
      }

      // 5️⃣ Attach user to req and continue
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  };
};

module.exports = authorizeRole;
