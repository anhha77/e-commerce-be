const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { OrderStatus, ShippingMethod } = require("../helpers/constant");

const orderItemSchema = Schema({
  orderItemId: {
    type: Schema.ObjectId,
    required: true,
    ref: "ProductVariation",
  },
  quantity: { type: Number, required: true },
});

const shippingMethodSchema = Schema({
  shippingType: {
    type: String,
    required: true,
    enum: [
      ShippingMethod.Standard,
      ShippingMethod.Express,
      ShippingMethod.Priority,
    ],
  },
  price: { type: Number, required: true },
});

const orderStatusSchema = Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        OrderStatus.Ordered,
        OrderStatus.InTransit,
        OrderStatus.Delivered,
        OrderStatus.Cancelled,
        OrderStatus.RequestCancelled,
        OrderStatus.Return,
        OrderStatus.RequestReturn,
      ],
    },
    setBy: { type: Schema.ObjectId, required: true, ref: "User" },
    dateSet: { type: Date, required: true },
  },
  { timestamps: true }
);

const orderSchema = Schema(
  {
    userId: { type: Schema.ObjectId, required: true, ref: "User" },
    orderItem: [orderItemSchema],
    orderDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true, enum: ["paypal", "cash"] },
    account: { type: String, required: false, default: "" },
    shippingAddress: {
      type: Schema.ObjectId,
      required: true,
      ref: "User.address",
    },
    shippingMethod: shippingMethodSchema,
    orderTotal: { type: Number, required: true },
    orderStatus: [orderStatusSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "Orders");
module.exports = Order;
