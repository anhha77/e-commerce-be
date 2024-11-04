const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Category = require("../models/Category");

const categoryController = {};

categoryController.getCategories = catchAsync(async (req, res, next) => {
  let { categoryName, page, limit, sortDirection } = req.query;

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 100;

  sortDirection = parseInt(sortDirection) || 1;

  const query = [];

  if (categoryName) {
    query.push({ categoryName: { $regex: categoryName, $options: "i" } });
  }

  const filterCriteria = query.length
    ? { $or: [...query, { isDeleted: false }] }
    : { isDeleted: false };

  const count = await Category.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);

  const offset = limit * page;

  const categories = await Category.find(filterCriteria)
    .sort({ categoryName: sortDirection })
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

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
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
