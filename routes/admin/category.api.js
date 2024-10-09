const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const authentication = require("../../middlewares/authentication");
const validators = require("../../middlewares/validators");
const { body } = require("express-validator");

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
    body("parentCategoryId").exists().custom(validators.checkObjectIdList),
    body("categoryName").exists().isString().notEmpty(),
  ])
);

module.exports = router;
