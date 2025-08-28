const mongoose = require("mongoose");
const Category = require("./Category");
const path = require("path");
const fs = require("fs").promises;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
    default: "0",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

productSchema.pre("save", async function (next) {
  if (!this.categoryId) {
    const others = await Category.findOne({ title: "others" });
    if (others) {
      this.categoryId = others._id;
    }
  }
  next();
});

productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const productFolder = path.join(
      __dirname,
      "/..",
      "uploads",
      "products",
      doc.title.toLowerCase()
    );

    console.log(productFolder);

    const imagePath = path.join(productFolder, doc.image);

    console.log(imagePath);

    const galleryPaths = doc.gallery.map((item) =>
      path.join(productFolder, item)
    );

    try {
      // delete image
      await fs.unlink(imagePath);

      // delete gallery
      await Promise.all(galleryPaths.map((item) => fs.unlink(item)));

      // delete product folder
      await fs.rmdir(productFolder);

      console.log("Product images removed.");
    } catch (error) {
      console.log("Error in deleting product images", error);
    }
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
