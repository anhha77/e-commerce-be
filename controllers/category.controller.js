const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Category = require("../models/Category");
const { CategoryType } = require("../helpers/constant");
const { populate } = require("dotenv");
const { model } = require("mongoose");

const categoryController = {};

categoryController.getCategories = catchAsync(async (req, res, next) => {
  let {
    categoryName,
    isDeleted,
    genderSearch,
    generalSearch,
    subSearch,
    page,
    limit,
  } = req.query;

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 100;

  const query = [];

  if (genderSearch === "true") {
    query.push({ type: CategoryType.GenderCategory });
  }

  if (generalSearch === "true") {
    query.push({ type: CategoryType.GeneralCategory });
  }

  if (subSearch === "true") {
    query.push({ type: CategoryType.SubCategory });
  }

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

module.exports = categoryController;
