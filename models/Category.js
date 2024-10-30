const { query } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  categoryName: { type: String, required: true },
  parentCategoryId: { type: Schema.ObjectId, required: false, ref: "Category" },
  avatarUrl: { type: String, required: false },
  isDeleted: { type: Boolean, default: false },
});

categorySchema.pre("find", function (next) {
  try {
    this.populate("parentCategoryId");
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre("findOne", function (next) {
  try {
    this.populate("parentCategoryId");
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre("updateOne", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    console.log("this is", doc);
    await Category.updateOne({ _id: doc._id }, { isDeleted: true });
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema, "Categories");
module.exports = Category;
