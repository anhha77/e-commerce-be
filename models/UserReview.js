const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReviewSchema = Schema(
  {
    userId: { type: Schema.ObjectId, required: true, ref: "User" },
    productVariationId: {
      type: Schema.ObjectId,
      required: true,
      ref: "ProductVariation",
    },
    ratingValue: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    comment: { type: String, required: true },
    imageUrl: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const UserReview = mongoose.model("UserReview", userReviewSchema, "Reviews");
module.exports = UserReview;
