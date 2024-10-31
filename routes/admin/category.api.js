const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const authentication = require("../../middlewares/authentication");
const validators = require("../../middlewares/validators");
const { body, param } = require("express-validator");

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
    body("imageUrl").optional().exists().isString().notEmpty(),
    body("childCategories").optional().custom(validators.checkCategoriesChild),
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
    body("imageUrl").optional().isString().notEmpty(),
    body("categoryName").exists().isString().notEmpty(),
    body("childCategories").optional().custom(validators.checkCategoriesChild),
  ]),
  categoryController.updateCategory
);

/**
 * @route DELETE /admin/category/:categoryId
 * @description Delete a category
 * @access Login required (Admin)
 */

router.delete(
  "/:categoryId",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    param("categoryId").exists().isString().custom(validators.checkObjectId),
  ]),
  categoryController.deleteCategory
);

module.exports = router;
