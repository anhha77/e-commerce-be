const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const Category = require("../models/Category");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { query, param } = require("express-validator");

/**
 * @route GET /category
 * @description Get categories of e-commerce shop
 * @query {categoryName, isDeleted, page, limit}
 * @access Public
 */

router.get("/", authentication.loginRequired, categoryController.getCategories);

/**
 * @route GET /category/:categoryId
 * @description Get specific category and it child (if it has)
 * @access Public
 */

router.get(
  "/:categoryId",
  authentication.loginRequired,
  validators.validate([
    param("categoryId").exists().isString().custom(validators.checkObjectId),
  ]),
  categoryController.getSingleCategory
);

module.exports = router;
