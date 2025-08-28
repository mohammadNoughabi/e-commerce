// /src/seeders/createDefaultCategory.js
const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");

async function createDefaultCategory() {
  try {
    // چک کن آیا دسته‌ی "سایر" وجود داره
    let others = await Category.findOne({ title: "others" });

    if (!others) {
      const imageName = "others.jpeg";

      // مسیر پوشه مقصد برای عکس دسته
      const categoryFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "categories",
        "others"
      );
      const destImagePath = path.join(categoryFolder, imageName);

      // مسیر عکس پیش‌فرض
      const srcImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        imageName
      );

      // اگه پوشه‌ی "others" وجود نداشت بسازش
      if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true });
      }

      // اگه عکس مقصد وجود نداشت، از public کپی کن
      if (!fs.existsSync(destImagePath)) {
        fs.copyFileSync(srcImagePath, destImagePath);
      }

      // دسته رو بساز
      await Category.create({
        title: "others",
        description: "Other Products",
        image: "others.jpeg",
        isDefault: true,
      });

      console.log("✅ Others category created successfullry");
    } else {
      console.log("ℹ️ Category 'others' already exists.");
    }
  } catch (err) {
    console.error("❌ error in deleting 'others' category':", err.message);
  }
}

module.exports = createDefaultCategory;
