const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Category = require("../models/Category");
const { populate } = require("dotenv");
const { model } = require("mongoose");

const categoryController = {};

categoryController.getCategories = catchAsync(async (req, res, next) => {
  let { categoryName, isDeleted, page, limit } = req.query;

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 10;

  const query = [];

  if (categoryName) {
    query.push({ categoryName: { $regex: categoryName, $options: "i" } });
  }

  if (isDeleted === "true") {
    query.push({ isDeleted: true });
  }

  const filterCriteria = query.length
    ? { $or: [...query] }
    : { isDeleted: false };

  const count = await Category.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);

  const offset = limit * page;

  const categories = await Category.find(filterCriteria)
    .populate({
      path: "parentCategoryId",
      model: "Category",
      populate: [
        {
          path: "parentCategoryId",
          model: "Category",
        },
      ],
    })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { categories, count, totalPages },
    null,
    "Get categories sucessfully"
  );
});

categoryController.getSingleCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId).populate({
    path: "parentCategoryId",
    model: "Category",
    populate: [
      {
        path: "parentCategoryId",
        model: "Category",
      },
    ],
  });

  if (!category) {
    throw new AppError(400, "Cannot find category", "Get Category Error");
  }

  const childCategories = await Category.find({ parentCategoryId: categoryId });

  return sendResponse(
    res,
    200,
    true,
    { category, childCategories },
    null,
    "Get Category Successfully"
  );
});

module.exports = categoryController;
