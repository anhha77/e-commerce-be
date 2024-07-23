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

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  let user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User Not Found", "Get Current User Error");

  user = user.toJSON();
  sendResponse(res, 200, true, user, null, "Get Current User Successfully");
});

userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;

  const filterConditions = [{ isDeleted: false }];
  if (filter.username) {
    filterConditions.push({
      username: { $regex: filter.username, $options: "i" },
    });
  }

  if (filter.email) {
    filterConditions.push({
      email: { $regex: filter.email, $options: "i" },
    });
  }

  if (filter.phoneNumber) {
    filterConditions.push({
      phoneNumber: { $regex: filter.phoneNumber },
    });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    return temp;
  });

  users = await Promise.all(promises);

  return sendResponse(
    res,
    200,
    true,
    { users, count, totalPages },
    null,
    "Get users successfully"
  );
});

module.exports = userController;
