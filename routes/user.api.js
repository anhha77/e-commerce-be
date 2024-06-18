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
    body("username", "Invalid username").exist().notEmpty(),
    body("email", "Invalid email")
      .exist()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exist().notEmpty(),
  ]),
  userController.register
);

module.exports = router;
