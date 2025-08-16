const User = require("../models/User");

exports.readAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.read = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
