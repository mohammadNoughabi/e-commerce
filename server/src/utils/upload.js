const multer = require("multer");
const path = require("path");
const slugify = require("slugify");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (req.baseUrl.includes("category")) {
      uploadPath = path.join(__dirname + "/.." + "/uploads" + "/categories");
    } else if (req.baseUrl.includes("product")) {
      uploadPath = path.join(__dirname + "/.." + "/uploads" + "/products");
    } else {
      uploadPath = path.join(__dirname + "/.." + "/uploads");
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const base = slugify(path.basename(file.originalname, ext), {
      lower: true,
      strict: true,
    });
    cb(null, `${uniqueSuffix}-${base}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
