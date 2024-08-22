const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../../middlewares/validators");
const authentication = require("../../middlewares/authentication");

module.exports = router;
