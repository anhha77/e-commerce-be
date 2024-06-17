const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    category: { type: Schema.ObjectId, required: true, ref: "Category" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    productVariationMasterId: [
      { type: Schema.ObjectId, required: true, ref: "ProductVariationMaster" },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "Products");
module.exports = Product;
