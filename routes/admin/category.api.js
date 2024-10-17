const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const authentication = require("../../middlewares/authentication");
const validators = require("../../middlewares/validators");
const { body, param } = require("express-validator");
const { CategoryType } = require("../../helpers/constant");

/**
 * @route POST admin/category
 * @description Create a category name
 * @body {parentCategoryId, categoryName}
 * @access Login required (Admin)
 */

router.post(
  "/",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    body("parentCategoryId").optional().custom(validators.checkObjectId),
    body("categoryName").exists().isString().notEmpty(),
    body("type")
      .exists()
      .isString()
      .notEmpty()
      .isIn([
        CategoryType.GenderCategory,
        CategoryType.GeneralCategory,
        CategoryType.SubCategory,
      ]),
  ]),
  categoryController.createCategory
);

/**
 * @route PUT admin/category/:categoryId
 * @description Update a category
 * @body {parentCategoryId, categoryName}
 * @access Login required (Admin)
 */

router.put(
  "/:categoryId",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    param("categoryId").exists().isString().custom(validators.checkObjectId),
    body("parentCategoryId").optional().custom(validators.checkObjectId),
    body("categoryName").optional().notEmpty().isString(),
  ]),
  categoryController.updateCategory
);

module.exports = router;
