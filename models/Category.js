const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  categoryName: { type: String, required: true },
  parentCategoryId: [
    { type: Schema.ObjectId, required: false, ref: "Category" },
  ],
  childCategoryId: [
    { type: Schema.ObjectId, required: false, ref: "Category" },
  ],
  isDeleted: { type: Boolean, default: false },
});

const Category = mongoose.model("Category", categorySchema, "Categories");
module.exports = Category;
