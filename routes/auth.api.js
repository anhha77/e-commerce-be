const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

/**
 * @route POST /auth/login
 * @description Log in with email and password
 * @body {email, password}
 * @access Public
 */

router.post(
  "/login",
  validators.validate([
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithUsernameAndPass
);

module.exports = router;
