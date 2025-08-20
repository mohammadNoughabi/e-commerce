const Category = require("../models/Category");

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.filename;

    if (!title || !image || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    let newCategory = new Category({
      title,
      image,
      description,
    });
    await newCategory.save();

    return res.status(200).json({ message: "Category created successfully" , newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!", error });
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

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({message:"category not found."})
    }
    await Category.findByIdAndDelete(id)
    return res.status(200).json({message:`Category deleted successfully`})
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
