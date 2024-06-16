var express = require("express");
var router = express.Router();

const authApi = require("./auth.api");
router.use("/auth", authApi);

const adminApi = require("./admin/index");
router.use("/admin", adminApi);

const userApi = require("./user/index");
router.use("/user", userApi);

module.exports = router;
