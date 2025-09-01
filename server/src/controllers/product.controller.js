const Product = require("../models/Product");
const path = require("path");
const fs = require("fs").promises;
const { fileExists } = require("../helpers/fileHelper");

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
      gallery: gallery,
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, categoryId } = req.body;
    const keepGallery = req.body.keepGallery
      ? JSON.parse(req.body.keepGallery)
      : [];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    const baseUploadPath = path.join(__dirname, "..", "uploads", "products");
    const oldFolder = path.join(baseUploadPath, product.title);
    const newFolder = path.join(baseUploadPath, title);

    // --- 1. Ensure product folder exists (rename if title changed)
    if (product.title !== title) {
      if (await fileExists(oldFolder)) {
        await fs.mkdir(newFolder, { recursive: true });
        // move existing files
        if (product.image) {
          const oldPath = path.join(oldFolder, product.image);
          const newPath = path.join(newFolder, product.image);
          if (await fileExists(oldPath)) {
            await fs.rename(oldPath, newPath);
          }
        }
        for (const g of product.gallery) {
          const oldPath = path.join(oldFolder, g);
          const newPath = path.join(newFolder, g);
          if (await fileExists(oldPath)) {
            await fs.rename(oldPath, newPath);
          }
        }
        // cleanup old folder
        try {
          await fs.rmdir(oldFolder);
        } catch (_) {}
      } else {
        await fs.mkdir(newFolder, { recursive: true });
      }
    } else {
      await fs.mkdir(newFolder, { recursive: true });
    }

    // --- 2. Handle main image replacement
    if (req.files?.image?.length) {
      // delete old image
      if (product.image) {
        const oldImgPath = path.join(newFolder, product.image);
        if (await fileExists(oldImgPath)) {
          await fs.unlink(oldImgPath);
        }
      }
      // move uploaded new one
      const uploaded = req.files.image[0];
      const tempPath = path.join(baseUploadPath, uploaded.filename);
      const destPath = path.join(newFolder, uploaded.filename);
      if (await fileExists(tempPath)) {
        await fs.rename(tempPath, destPath);
      }
      product.image = uploaded.filename;
    }

    // --- 3. Handle gallery images
    // delete removed ones
    for (const g of product.gallery) {
      if (!keepGallery.includes(g)) {
        const filePath = path.join(newFolder, g);
        if (await fileExists(filePath)) {
          await fs.unlink(filePath);
        }
      }
    }

    let finalGallery = [...keepGallery];

    // add new uploaded ones
    if (req.files?.gallery?.length) {
      for (const file of req.files.gallery) {
        const tempPath = path.join(baseUploadPath, file.filename);
        const destPath = path.join(newFolder, file.filename);
        if (await fileExists(tempPath)) {
          await fs.rename(tempPath, destPath);
        }
        finalGallery.push(file.filename);
      }
    }

    // --- 4. Update product fields
    product.title = title;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.categoryId = categoryId || null;
    product.gallery = finalGallery;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error in update product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

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
