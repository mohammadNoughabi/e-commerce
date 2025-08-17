const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let uploadPath;
      if (req.path.includes("category")) {
        let categoryTitle = req.body.title;
        if (!categoryTitle) cb(new Error("Category title is required"), null);
        uploadPath = path.join(
          __dirname,
          "uploads",
          "categories",
          categoryTitle
        );
      } else if (req.path.includes("blog")) {
        let blogTitle = req.body.title;
        if (!blogTitle) cb(new Error("Blog title is required."), null);
        uploadPath = path.join(__dirname, "uploads", "blogs", blogTitle);
      } else if (req.path.includes("product")) {
        let productTitle = req.body.title;
        if (!productTitle) cb(new Error("Product title is required"), null);
        uploadPath = path.join(__dirname, "uploads", "product", productTitle);
      } else {
        return cb(new Error("Invalid route."));
      }
      mkdir(uploadPath, { recursive: true });
    } catch (error) {
      cb(new Error(`Failed to create directory: ${error.message}`), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = upload;
