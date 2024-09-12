const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../../middlewares/validators");
const authentication = require("../../middlewares/authentication");

/**
 * @route POST /admin/users
 * @description Create a user
 * @access Login required (Admin)
 */
router.post(
  "/",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    body("avatarUrl", "Invalid avartarUrl").optional().notEmpty(),
    body("username", "Invalid username").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    body("birthOfDate", "Invalid birthdate").optional().notEmpty(),
    body("phoneNumber", "Invalid phone number")
      .optional()
      .notEmpty()
      .isNumeric(),
    body("role", "Invalid role").exists().notEmpty().isIn("user", "admin"),
    body("address").optional().custom(validators.checkAddressField),
  ]),
  userController.createUser
);

/**
 * @route GET /admin/users
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
 * @route GET /admin/users/:id
 * @description Get detail of a user
 * @access Login required (Admin)
 */

router.get(
  "/:id",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);

/**
 * @route PUT /admin/users/:id
 * @description Update user profile
 * @body {avatarUrl, password, birthOfDate, phoneNumber, cartItemId, addressId}
 * @access Login required (Admin)
 */

router.put(
  "/:id",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.updateCustomerProfile
);

/**
 * @route DELETE /admin/users/:id
 * @description Delete user account
 * @access Login required (Admin)
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  (req, res, next) => authentication.validateRole(req, res, next, ["admin"]),
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.deleteSingleUser
);

module.exports = router;