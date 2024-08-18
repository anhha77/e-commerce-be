const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

authController.loginWithUsernameAndPass = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");

  const accessToken = await user.generateToken();

  if (user.address.length > 0) {
    const address = await User.aggregate([
      { $match: { _id: user._id } },
      { $unwind: "$address" },
      { $sort: { "address.isDefault": -1, "address.updatedAt": -1 } },
      { $group: { _id: "$_id", address: { $push: "$address" } } },
      { $project: { _id: 0 } },
    ]).exec();

    const addressList = address[0]["address"];
    user.address = addressList;
  }

  user = user.toJSON();

  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

module.exports = authController;
