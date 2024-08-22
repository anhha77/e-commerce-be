const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
router.use("/user", userApi);

const paymentApi = require("./payment.api");
router.use("/payment", paymentApi);

const orderApi = require("./order.api");
router.use("/orders", orderApi);

const categoryApi = require("./category.api");
router.use("/category", categoryApi);

const variationApi = require("./variation.api");
router.use("/variation", variationApi);

const productApi = require("./product.api");
router.use("/products", productApi);

module.exports = router;
