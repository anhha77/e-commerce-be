const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CategoryType } = require("../helpers/constant");

const categorySchema = Schema({
  categoryName: { type: String, required: true },
  parentCategoryId: { type: Schema.ObjectId, required: false, ref: "Category" },
  type: {
    type: String,
    required: true,
    enum: [
      CategoryType.GenderCategory,
      CategoryType.GeneralCategory,
      CategoryType.SubCategory,
    ],
  },
  isDeleted: { type: Boolean, default: false },
});

const Category = mongoose.model("Category", categorySchema, "Categories");
module.exports = Category;
