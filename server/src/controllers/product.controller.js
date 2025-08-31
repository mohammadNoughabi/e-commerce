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

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if required fields are provided
    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }

    // Define paths
    const baseUploadPath = path.join(__dirname, "..", "uploads", "products");
    const oldProductFolder = path.join(baseUploadPath, existingProduct.title);
    const newProductFolder = path.join(baseUploadPath, title);

    // If product title changed, we need to move all files to new folder
    if (existingProduct.title !== title) {
      // Create new directory if it doesn't exist
      await fs.mkdir(newProductFolder, { recursive: true });

      // Move main image if it exists
      if (existingProduct.image) {
        const oldImagePath = path.join(oldProductFolder, existingProduct.image);
        const newImagePath = path.join(newProductFolder, existingProduct.image);

        if (await fileExists(oldImagePath)) {
          await fs.rename(oldImagePath, newImagePath);
        }
      }

      // Move gallery images if they exist
      if (existingProduct.gallery && existingProduct.gallery.length > 0) {
        for (let imageName of existingProduct.gallery) {
          const oldImagePath = path.join(oldProductFolder, imageName);
          const newImagePath = path.join(newProductFolder, imageName);

          if (await fileExists(oldImagePath)) {
            await fs.rename(oldImagePath, newImagePath);
          }
        }
      }

      // Remove old directory if it's empty
      try {
        await fs.rmdir(oldProductFolder);
      } catch (err) {
        // Directory might not be empty if there were other files, that's okay
      }
    }

    // Handle new main image upload if provided
    let newImageName = existingProduct.image;
    if (req.files?.image) {
      // Delete old main image if it exists
      if (existingProduct.image) {
        const oldImagePath = path.join(newProductFolder, existingProduct.image);
        if (await fileExists(oldImagePath)) {
          await fs.unlink(oldImagePath);
        }
      }

      // Save new main image
      newImageName = req.files.image[0].filename;
      const tempImagePath = path.join(baseUploadPath, newImageName);
      const newImagePath = path.join(newProductFolder, newImageName);

      // Ensure directory exists
      await fs.mkdir(newProductFolder, { recursive: true });

      // Move image from temp location to product folder
      await fs.rename(tempImagePath, newImagePath);
    }

    // Handle gallery images
    let newGallery = [...existingProduct.gallery];

    // Process new gallery uploads if any
    if (req.files?.gallery) {
      for (let file of req.files.gallery) {
        const tempFilePath = path.join(baseUploadPath, file.filename);
        const newFilePath = path.join(newProductFolder, file.filename);

        // Ensure directory exists
        await fs.mkdir(newProductFolder, { recursive: true });

        // Move file from temp location to product folder
        await fs.rename(tempFilePath, newFilePath);

        // Add to gallery array
        newGallery.push(file.filename);
      }
    }

    // Update product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        stock,
        categoryId: categoryId || null,
        image: newImageName,
        gallery: newGallery,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
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
