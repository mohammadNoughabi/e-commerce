const multer = require("multer");
const path = require("path");
const fs = require("fs");

class Uploader {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "uploads");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
      },
    });
    this.multer = multer({ storage: this.storage });
  }

  uploadSingle(req, res, fieldName, destination) {
    req.uploadPath = destination;
    return new Promise((resolve, reject) => {
      this.multer.single(fieldName)(req, res, (err) => {
        if (err) return reject(err);
        resolve(req.files);
      });
    });
  }

  uploadMultiple(req, res, fieldName, destination) {
    req.uploadPath = destination;
    return new Promise((resolve, reject) => {
      this.multer.array(fieldName)(req, res, (err) => {
        if (err) return reject(err);
        resolve(req.files);
      });
    });
  }
}

module.exports = new Uploader();
