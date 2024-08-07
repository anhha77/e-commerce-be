const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const myRedis = require("../services/redis/redisInit");

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
  const redisClient = await myRedis.getConnection();
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 0;
  limit = parseInt(limit) || 20;

  const sortDirection = parseInt(filter.sortDirection) || -1;
  const orderBy = filter.orderBy || "username";
  const sort = {};
  sort[orderBy] = sortDirection;

  let count;
  let totalPages;
  let users;

  const key = req.url;
  const value = await redisClient.get(key);

  if (!value) {
    console.log("Cache miss for", key);
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

    count = await User.countDocuments(filterCriteria);
    totalPages = Math.ceil(count / limit);
    const offset = limit * page;

    users = await User.find(filterCriteria)
      .sort(sort)
      .skip(offset)
      .limit(limit);

    const promises = users.map(async (user) => {
      let temp = user.toJSON();
      return temp;
    });

    users = await Promise.all(promises);

    redisClient.setEx(key, 300, JSON.stringify({ users, count, totalPages }));
  } else {
    console.log("Cache hit for", key);
    const results = JSON.parse(value);
    users = results.users;
    count = results.count;
    totalPages = results.totalPages;
  }

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

userController.updateProfile = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  let user = await User.findById(currentUserId, "+password");
  if (!user) throw new AppError(400, "User not found", "Update user error");

  const allows = [
    "avatartUrl",
    "birthOfDate",
    "phoneNumber",
    "cartItem",
    "address",
  ];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body["oldPassword"] !== undefined && req.body["newPassword"]) {
    const isMatch = await bcrypt.compare(
      req.body["oldPassword"],
      user.password
    );
    if (!isMatch)
      throw new AppError(400, "Invalid Credentials", "Update user error");
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body["newPassword"], salt);
    user["password"] = password;
  }

  await user.save();

  return sendResponse(res, 200, true, user, null, "Update user successfully");
});

module.exports = userController;
