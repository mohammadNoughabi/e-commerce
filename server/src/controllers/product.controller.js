const Product = require("../models/Product");
const path = require("path");
const fs = require("fs").promises;

exports.create = async (req, res) => {
  try {
    const { title, description, price, stock, categoryId } = req.body;
    if (!title || !req.files?.image || !price) {
      return res
        .status(400)
        .json({ message: "Title, Image and Price are required" });
    }

    const image = req.files.image[0].filename;
    const gallery = req.files.gallery?.map((item) => item.filename) || [];

    // 🔹 Create product folder
    const productFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "products",
      title
    );
    await fs.mkdir(productFolder, { recursive: true });

    // 🔹 Move main image
    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "products",
      image
    );
    const newImagePath = path.join(productFolder, image);
    await fs.rename(oldImagePath, newImagePath);

    // 🔹 Move gallery images
    for (let g of gallery) {
      const oldGalleryPath = path.join(
        __dirname,
        "..",
        "uploads",
        "products",
        g
      );
      const newGalleryPath = path.join(productFolder, g);
      await fs.rename(oldGalleryPath, newGalleryPath);
    }

    // 🔹 Save only relative paths in DB
    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      categoryId,
      image: image,
      gallery: gallery ,
    });

    await newProduct.save();

    return res
      .status(200)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    console.error("❌ Error in create product:", error);
    return res.status(500).json({ message: "internal server error." });
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
    });
    if (!product) {
      return res.status(400).json({ message: "Product not found." });
    }
    return res.status(200).json({ product, relatedProducts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.readAll = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Product deleted successfully.", id });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
