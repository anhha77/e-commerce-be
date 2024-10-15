const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Category = require("../models/Category");
const { CategoryType } = require("../helpers/constant");

const categoryController = {};

categoryController.createCategory = catchAsync(async (req, res, next) => {
  let { parentCategoryId, categoryName, type } = req.body;
  const data = {};

  if (type === CategoryType.GenderCategory) {
    if (parentCategoryId) {
      throw new AppError(
        400,
        "Gender Category cannot have parent category",
        "Create Category Error"
      );
    }

    const check = await Category.findOne({ categoryName });
    if (check) {
      throw new AppError(
        400,
        "Gender Category cannot have multi categories with the same name",
        "Create Category Error"
      );
    }
  }

  if (req.body["parentCategoryId"]) {
    let check = await Category.findOne({
      parentCategoryId,
      categoryName,
      type,
    });
    if (check) {
      throw new AppError(
        400,
        "This category already assign to this parent category",
        "Create Category Error"
      );
    }
  }

  const fields = ["parentCategoryId", "categoryName", "type"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  });

  const category = await Category.create(data);

  return sendResponse(
    res,
    200,
    true,
    category,
    null,
    "Create Category Successfully"
  );
});

module.exports = categoryController;
