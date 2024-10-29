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

categorySchema.pre("deleteOne", async function (next) {
  try {
    await Category.deleteMany({ parentCategoryId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema, "Categories");
module.exports = Category;
