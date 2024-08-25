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
 * @route PUT /users/me
 * @description Update user profile
 @body {avatarUrl, password, birthOfDate, phoneNumber, cartItemId, addressId}
 * @access Login required 
*/

router.put("/me", authentication.loginRequired, userController.updateProfile);

/**
 * @route DELETE /users/me
 * @description Delete user account
 * @access Login required
 */

router.delete(
  "/me",
  authentication.loginRequired,
  userController.deleteCurrentUser
);

module.exports = router;
