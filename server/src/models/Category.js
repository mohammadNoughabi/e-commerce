const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

categorySchema.post("save", async function (doc) {
  if (doc.title !== "others") {
    const categoryFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "categories",
      doc.title
    );

    try {
      // Create category-specific folder
      await fs.mkdir(categoryFolder, { recursive: true });

      // Source file path (where multer saved it)
      const oldPath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        doc.image
      );

      // New destination path
      const newPath = path.join(categoryFolder, doc.image);

      // Move the image file
      await fs.rename(oldPath, newPath);

      console.log("Category image moved successfully to folder:", newPath);
    } catch (error) {
      console.error("Error in creating category folder:", error);
    }
  }
});

categorySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // دسته‌های پیش‌فرض نباید اصلاً اینجا حذف بشن،
    // ولی برای اطمینان یک چک اضافه بذاریم
    if (doc.isDefault) return;

    const categoryFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "categories",
      doc.title
    );

    const imagePath = path.join(categoryFolder, doc.image);

    try {
      await fs.unlink(imagePath);
      console.log("Category image deleted:", imagePath);

      await fs.rm(categoryFolder, { recursive: true });
    } catch (error) {
      console.error("Error deleting category image:", error);
    }
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
