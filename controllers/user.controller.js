const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { username, email, password } = req.body;
  const currentUserId = req.userId;

  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "User already exists", "Registration Error");
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ username, email, password });
  const accessToken = await user.generateToken();
  user = user.toJSON();

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User Successful"
  );
});

module.exports = userController;
