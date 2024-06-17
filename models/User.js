const mongoose = require("mongoose");
const { Roles } = require("../helpers/constant");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema, "Users");
module.exports = User;
