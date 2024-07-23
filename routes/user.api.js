const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /users
 * @description User Registration
 * @body {username, email, password}
 * @access Public
 */

router.post(
  "/",
  validators.validate([
    body("username", "Invalid username").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */

router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route GET /users
 * @description Get all users with filter
 * @access Login required (Admin)
 */

router.get(
  "/",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  userController.getUsers
);

/**
 * @route GET /users/:id
 * @description Get detail of a user
 * @access Login required (Admin)
 */

router.get(
  "/:id",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  userController.getSingleUser
);

module.exports = router;
