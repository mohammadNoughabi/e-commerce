const mongoose = require("mongoose");
const Category = require("./Category");


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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

productSchema.pre("save", async function (next) {
  if (!this.categoryId) {
    let others = await Category.findOne({ title: "سایر" });

    if (!others) {
      others = await Category.create({
        title: "سایر",
        description: "سایر محصولات",
        image: "../../../client/public/images/others.jpeg",
      });
    }

    this.categoryId = others._id;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
