const Category = require("../models/Category")




exports.create = async (req ,res) => {}

exports.read = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({ message: "Category not found." });
    }
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.readAll = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.update = async (req ,res) => {}


exports.delete = async (req ,res) => {}
