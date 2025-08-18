const Category = require("../models/Category");
const uploader = require("../utils/uploader");

exports.create = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const imageFile = req.files[0];
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    let newCategory = new Category({
      title,
      image,
      description,
    });
    await newCategory.save();
    uploader.uploadSingle(
      req,
      res,
      "image",
      `uploads/categories/${newCategory.title}`
    );
    return res.status(200).json({
      message: `Category ${newCategory.title} crated successfully`,
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

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

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {};
