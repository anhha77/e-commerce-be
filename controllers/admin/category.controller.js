const { AppError, sendResponse, catchAsync } = require("../../helpers/utils");
const Category = require("../../models/Category");

const categoryController = {};

categoryController.createCategory = catchAsync(async (req, res, next) => {
  let { parentCategoryId, categoryName, childCategories } = req.body;

  const data = {};
  const childData = [];

  let check = await Category.findOne({
    parentCategoryId,
    categoryName,
  });
  if (check) {
    throw new AppError(
      400,
      "This category already exist",
      "Create Category Error"
    );
  }

  const fields = ["parentCategoryId", "categoryName", "imageUrl"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  });

  const category = await Category.create(data);

  const childFields = ["categoryName", "imageUrl"];

  if (childCategories) {
    childCategories.forEach((item) => {
      const itemData = {};
      childFields.forEach((field) => {
        if (item[field] !== undefined) {
          itemData[field] = item[field];
        }
      });
      itemData.parentCategoryId = category._id;
      childData.push(itemData);
    });

    childCategories = await Category.insertMany(childData);
  }

  return sendResponse(
    res,
    200,
    true,
    { category, childCategories },
    null,
    "Create Category Successfully"
  );
});

categoryController.updateCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  let { parentCategoryId, categoryName, childCategories } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(400, "Cannot find category", "Update Category Error");
  }

  if (parentCategoryId) {
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      throw new AppError(
        400,
        "Cannot find parent category",
        "Update Category Error"
      );
    }
  }

  if (
    parentCategoryId !== category.parentCategoryId._id.toString() ||
    categoryName !== category.categoryName
  ) {
    const isCategoryExist = await Category.findOne({
      parentCategoryId,
      categoryName,
    });
    if (isCategoryExist) {
      throw new AppError(
        400,
        "This category name has exist",
        "Update Category Error"
      );
    }
  }

  fields = ["parentCategoryId", "categoryName", "imageUrl"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      category[field] = req.body[field];
    }
  });

  await category.save();

  if (childCategories) {
    const query = childCategories.map((item) => ({
      categoryName: item.categoryName,
    }));

    const isExist = await Category.find({ $or: query });
    if (isExist.length) {
      throw new AppError(
        400,
        " This category already exist",
        "Update Category Error"
      );
    }

    const childFields = ["categoryName", "imageUrl"];
    const childData = [];
    childCategories.forEach((item) => {
      const itemData = {};
      childFields.forEach((field) => {
        if (item[field] !== undefined) {
          itemData[field] = item[field];
        }
      });
      itemData.parentCategoryId = category._id;
      childData.push(itemData);
    });

    childCategories = await Category.insertMany(childData);
  }

  return sendResponse(
    res,
    200,
    true,
    { category, childCategories },
    null,
    "Update Category Successfully"
  );
});

categoryController.deleteCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  let category = await Category.updateOne(
    { _id: categoryId },
    { isDeleted: true }
  );
  if (!category) {
    throw new AppError(400, "Cannot find category", "Delete Category Error");
  }

  // category = await Category.deleteOne({ _id: categoryId });

  return sendResponse(
    res,
    200,
    true,
    { category },
    null,
    "Delete Category Successfully"
  );
});

module.exports = categoryController;
