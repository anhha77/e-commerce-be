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

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 20;

  const sortDirection = parseInt(filter.sortDirection) || -1;
  const orderBy = filter.orderBy || "username";
  const sort = {};
  sort[orderBy] = sortDirection;

  let query = [];
  if (filter.searchQuery) {
    if (filter.usernameSearch === "true") {
      query.push({ username: { $regex: filter.searchQuery, $options: "i" } });
    }

    if (filter.emailSearch === "true") {
      query.push({ email: { $regex: filter.searchQuery, $options: "i" } });
    }

    if (filter.phoneNumberSearch === "true") {
      query.push({
        phoneNumber: { $regex: filter.searchQuery, $options: "i" },
      });
    }
  }

  const filterCriteria = query.length
    ? { $and: [{ isDeleted: false }, { $or: [...query] }] }
    : { isDeleted: false };

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * page;

  let users = await User.find(filterCriteria)
    .sort(sort)
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

userController.getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get user error");

  user = user.toJSON();

  return sendResponse(res, 200, true, user, null, "Get user successfully");
});

module.exports = userController;
