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
    // console.log("this is", this.getFilter());
    const doc = await this.model.findOne(this.getFilter());
    // console.log(doc);
    const isExist = await this.model.findOne({ parentCategoryId: doc._id });
    // console.log(isExist);
    if (isExist) {
      await Category.updateOne({ _id: isExist._id }, { isDeleted: true });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema, "Categories");
module.exports = Category;
