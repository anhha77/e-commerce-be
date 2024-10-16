const { AppError, sendResponse, catchAsync } = require("../../helpers/utils");
const Category = require("../../models/Category");
const { CategoryType } = require("../../helpers/constant");

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
    if (type === CategoryType.GeneralCategory) {
      const checkType = await Category.findById(parentCategoryId, { type: 1 });
      if (checkType.type !== CategoryType.GenderCategory) {
        throw new AppError(
          400,
          "Cannot assign to this category",
          "Create Category Error"
        );
      }
    }

    if (type === CategoryType.SubCategory) {
      const checkType = await Category.findById(parentCategoryId, { type: 1 });
      if (checkType.type !== CategoryType.GeneralCategory) {
        throw new AppError(
          400,
          "Cannot assign to this category",
          "Create Category Error"
        );
      }
    }

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

categoryController.updateCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const { parentCategoryId, categoryName } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(400, "Cannot find category", "Update Category Error");
  }

  if (categoryName) {
    const checkValid = await Category.findOne({ categoryName });
  }
});

module.exports = categoryController;
