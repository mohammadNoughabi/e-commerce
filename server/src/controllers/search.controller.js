const Product = require("../models/Product");
const Category = require("../models/Category");

exports.search = async (req, res) => {
  try {
    const searchTerm = req.query.searchItem;
    const searchRegex = new RegExp(searchTerm, "i");
    const products = await Product.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });
    const categories = await Category.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });

    return res.status(200).json({ products, categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
