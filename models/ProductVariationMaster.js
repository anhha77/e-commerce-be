const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productVariationMasterSchema = Schema({
  name: { type: String, required: true },
  variationMasterId: {
    type: Schema.ObjectId,
    required: true,
    ref: "Variation",
  },
  productImage: [{ type: String, required: true }],
  ownerId: { type: Schema.ObjectId, required: true, ref: "User" },
  productVariationId: [
    { type: Schema.ObjectId, required: true, ref: "ProductVariation" },
  ],
  description: { type: String, required: false },
  price: { type: Number, required: true },
  productId: { type: Schema.ObjectId, required: true, ref: "Product" },
});

const ProductVariationMaster = mongoose.model(
  "ProductVariationMaster",
  productVariationMasterSchema
);
module.exports = ProductVariationMaster;
