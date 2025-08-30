const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
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

categorySchema.post("findOneAndUpdate", async function (doc) {
  if (doc && this.getUpdate().$set && this.getUpdate().$set.title) {
    // If title was updated, we need to update the folder name
    const oldTitle = this.getQuery().title || doc.title;
    const newTitle = this.getUpdate().$set.title;
    
    if (oldTitle !== newTitle) {
      const oldFolderPath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        oldTitle
      );
      
      const newFolderPath = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        newTitle
      );
      
      try {
        await fs.rename(oldFolderPath, newFolderPath);
        console.log(`Category folder renamed from ${oldTitle} to ${newTitle}`);
      } catch (error) {
        console.error("Error renaming category folder:", error);
      }
    }
  }
});

categorySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Prevent deletion of default categories
    if (doc.isDefault) return;

    const categoryFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "categories",
      doc.title
    );

    try {
      await fs.rm(categoryFolder, { recursive: true, force: true });
      console.log("Category folder deleted:", categoryFolder);
    } catch (error) {
      console.error("Error deleting category folder:", error);
    }
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;