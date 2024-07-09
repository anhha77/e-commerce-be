const express = require("express");
const router = express.Router();

const authApi = require("./auth.api");
router.use("/auth", authApi);

const adminApi = require("./admin/index");
router.use("/admin", adminApi);

const userApi = require("./user.api");
router.use("/users", userApi);

const reviewApi = require("./review.api");
router.use("/reviews", reviewApi);

const orderApi = require("./order.api");
router.use("/orders", orderApi);

const categoryApi = require("./category.api");
router.use("/category", categoryApi);

const productApi = require("./product.api");
router.use("/products", productApi);

module.exports = router;
