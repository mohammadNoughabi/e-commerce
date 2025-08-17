const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[0];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized! No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userRole !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};


module.exports = authorizeRole