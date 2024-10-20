const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const Category = require("../models/Category");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { query } = require("express-validator");

/**
 * @route GET /category
 * @description Get categories of e-commerce shop
 * @query {categoryName, isDeleted, genderSearch, generalSearch, subSearch, page, limit}
 * @access Public
 */

router.get(
  "/",
  authentication.loginRequired,
  validators.validate([
    query("categoryName").optional().exists().notEmpty().isString(),
    query("isDeleted")
      .optional()
      .exists()
      .isString()
      .notEmpty()
      .isIn(["true", "false"]),
    query("genderSearch")
      .exists()
      .isString()
      .notEmpty()
      .isIn(["true", "false"]),
    query("generalSearch")
      .exists()
      .isString()
      .notEmpty()
      .isIn(["true", "false"]),
    query("subSearch").exists().isString().notEmpty().isIn(["true", "false"]),
  ]),
  categoryController.getCategories
);

module.exports = router;
