const Category = require("../models/Category");
const Product = require("../models/Product");
const fs = require("fs").promises;
const path = require("path");

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

    return res
      .status(200)
      .json({ message: "Category created successfully", newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!", error });
  }
};

exports.read = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found." });
    }
    const products = await Product.find({ categoryId: categoryId });
    return res.status(200).json({ category, products });
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

exports.update = async (req, res) => {
  try {
    let id = req.params.id;
    let category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found in database." });
    }

    // Get updated fields
    const { title, description } = req.body;

    // Check if title is being changed to avoid duplicates
    if (title && title !== category.title) {
      const existingCategory = await Category.findOne({ title });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category title already exists." });
      }
    }

    // Handle image update
    let image = category.image; // Keep existing image by default
    if (req.file) {
      // Delete old image if a new one is uploaded
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        category.title,
        category.image
      );

      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error("Error deleting old image:", error);
      }

      image = req.file.filename;

      // Move new image from temporary location to category folder
      const tempImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        req.file.filename
      );

      const newImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        title || category.title, // Use new title if provided, else keep old
        req.file.filename
      );

      try {
        // Ensure category folder exists
        const categoryFolder = path.dirname(newImagePath);
        await fs.mkdir(categoryFolder, { recursive: true });

        // Move the image
        await fs.rename(tempImagePath, newImagePath);
        console.log("New image moved to category folder:", newImagePath);
      } catch (error) {
        console.error("Error moving new image:", error);
        return res
          .status(500)
          .json({ message: "Error processing image", error });
      }
    }

    // If title changed, we need to move the folder (handled by model hook)
    // and update image path if necessary
    const finalTitle = title || category.title;

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { title: finalTitle, image, description },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ message: "Category updated successfully.", updatedCategory });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    if (category.isDefault) {
      return res
        .status(400)
        .json({ message: "Cannot delete default category." });
    }

    await Category.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: `Category deleted successfully`, id });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
