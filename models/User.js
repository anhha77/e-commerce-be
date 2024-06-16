const mongoose = require("mongoose");
const { Roles } = require("../helpers/constant");
const Schema = mongoose.Schema;

const cartItemSchema = Schema(
  {
    productItemId: {
      type: Schema.ObjectId,
      required: true,
      ref: "ProductVariation",
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const addressSchema = Schema({
  addressLocation: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isDefault: { type: Boolean, required: true, default: false },
});

const userSchema = Schema(
  {
    avatarUrl: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthOfDate: { type: Date, required: false },
    phoneNumber: { type: String, required: false },
    role: { type: String, required: true, enum: [Roles.ADMIN, Roles.USER] },
    cartItem: [cartItemSchema],
    address: [addressSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
