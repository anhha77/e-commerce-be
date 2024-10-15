const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const authentication = require("../../middlewares/authentication");
const validators = require("../../middlewares/validators");
const { body } = require("express-validator");
const { CategoryType } = require("../../helpers/constant");

/**
 * @route GET /category
 * @description Get all the category of e-commerce shop
 * @access Login required
 */

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
      .isIn(
        CategoryType.GenderCategory,
        CategoryType.GeneralCategory,
        CategoryType.SubCategory
      ),
  ])
);

module.exports = router;
