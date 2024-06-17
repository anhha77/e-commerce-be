const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productVariationSchema = Schema(
  {
    quantityInStore: { type: Number, required: true },
    variantionId: { type: Schema.ObjectId, required: true, ref: "Variation" },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    productVariationMasterId: {
      type: Schema.ObjectId,
      required: true,
      ref: "ProductVariationMaster",
    },
  },
  { timestamps: true }
);

const ProductVariation = mongoose.model(
  "ProductVariation",
  productVariationSchema,
  "Variations"
);
module.exports = ProductVariation;
