const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const variationSchema = Schema(
  {
    variationType: { type: String, required: true, enum: ["Size", "Colour"] },
    value: { type: String, required: true },
    ownerId: { type: Schema.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Variation = mongoose.model(
  "Variation",
  variationSchema,
  "VariationSetting"
);
module.exports = Variation;
