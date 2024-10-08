const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const myRedis = require("../services/redis/redisInit");
const { default: mongoose } = require("mongoose");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { username, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "User already exists", "Registration Error");
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ username, email, password });
  const accessToken = await user.generateToken();
  user = user.toJSON();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User Successfully"
  );
});

userController.createUser = catchAsync(async (req, res, next) => {
  let { username, email, password } = req.body;
  const allows = ["avatarUrl", "birthOfDate", "phoneNumber", "role", "address"];
  const data = {};
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "User already exist", "Registration Error");
  }

  data.username = username;
  data.email = email;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  data.password = password;
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  });

  user = await User.create(data);
  user = user.toJSON();
  return sendResponse(res, 200, true, user, null, "Create User Successfully");
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  let currentUserId = req.userId;
  currentUserId = new mongoose.Types.ObjectId(currentUserId);

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

  let countActive;
  let totalPagesActive;
  let usersActive;

  let countDeleted;
  let totalPagesDeleted;
  let usersDeleted;

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

    const filterCriteria = query.length ? { $or: [...query] } : {};

    const filterCriteriaActive = query.length
      ? { $and: [{ isDeleted: false }, { $or: [...query] }] }
      : { isDeleted: false };

    const filterCriteriaDeleted = query.length
      ? { $and: [{ isDeleted: true }, { $or: [...query] }] }
      : { isDeleted: true };

    count = await User.countDocuments(filterCriteria);
    totalPages = Math.ceil(count / limit);

    countActive = await User.countDocuments(filterCriteriaActive);
    totalPagesActive = Math.ceil(countActive / limit);

    countDeleted = await User.countDocuments(filterCriteriaDeleted);
    totalPagesDeleted = Math.ceil(countDeleted / limit);

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

    usersActive = await User.find(filterCriteriaActive)
      .sort(sort)
      .skip(offset)
      .limit(limit);
    const promisesActive = usersActive.map(async (user) => {
      let temp = user.toJSON();
      return temp;
    });
    usersActive = await Promise.all(promisesActive);

    usersDeleted = await User.find(filterCriteriaDeleted)
      .sort(sort)
      .skip(offset)
      .limit(limit);
    const promisesDeleted = usersDeleted.map(async (user) => {
      let temp = user.toJSON();
      return temp;
    });
    usersDeleted = await Promise.all(promisesDeleted);

    redisClient.setEx(
      key,
      300,
      JSON.stringify({
        users,
        count,
        totalPages,
        usersActive,
        countActive,
        totalPagesActive,
        usersDeleted,
        countDeleted,
        totalPagesDeleted,
      })
    );

    for (const user of users) {
      let urlList = await redisClient.get(`${user._id}`);
      urlList = JSON.parse(urlList);
      if (!urlList) {
        urlList = [];
      }
      urlList = [...urlList, key];
      redisClient.setEx(`${user._id}`, 300, JSON.stringify(urlList));
    }
  } else {
    console.log("Cache hit for", key);
    const results = JSON.parse(value);

    users = results.users;
    count = results.count;
    totalPages = results.totalPages;

    usersActive = results.usersActive;
    countActive = results.countActive;
    totalPagesActive = results.totalPagesActive;

    usersDeleted = results.usersDeleted;
    countDeleted = results.countDeleted;
    totalPagesDeleted = results.totalPagesDeleted;
  }

  return sendResponse(
    res,
    200,
    true,
    {
      users,
      count,
      totalPages,
      usersActive,
      countActive,
      totalPagesActive,
      usersDeleted,
      countDeleted,
      totalPagesDeleted,
    },
    null,
    "Get users successfully"
  );
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  let userId = req.params.id;
  userId = new mongoose.Types.ObjectId(userId);

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get user error");

  user = user.toJSON();

  return sendResponse(res, 200, true, user, null, "Get user successfully");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  let currentUserId = req.userId;
  currentUserId = new mongoose.Types.ObjectId(currentUserId);
  const redisClient = await myRedis.getConnection();

  let user = await User.findById(currentUserId, "+password");

  if (!user) throw new AppError(400, "User not found", "Update user error");

  const allows = [
    "avatarUrl",
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

  if (
    req.body["oldPassword"] !== undefined &&
    req.body["newPassword"] !== undefined
  ) {
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

  if (user.address.length > 0) {
    const address = await User.aggregate([
      { $match: { _id: currentUserId } },
      { $unwind: "$address" },
      { $sort: { "address.isDefault": -1, "address.updatedAt": -1 } },
      { $group: { _id: "$_id", address: { $push: "$address" } } },
      { $project: { _id: 0 } },
    ]).exec();
    const addressList = address[0]["address"];
    user.address = addressList;
  }

  await user.save();

  await myRedis.validateData(redisClient, `${currentUserId}`);

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update profile successfully"
  );
});

userController.updateCustomerProfile = catchAsync(async (req, res, next) => {
  let userId = req.params.id;
  userId = new mongoose.Types.ObjectId(userId);
  const redisClient = await myRedis.getConnection();

  let user = await User.findById(userId);

  if (!user) throw new AppError(400, "User not found", "Update user error");

  const allows = [
    "avatarUrl",
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

  await user.save();

  if (user.address.length > 0) {
    const address = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$address" },
      { $sort: { "address.isDefault": -1, "address.updatedAt": -1 } },
      { $group: { _id: "$_id", address: { $push: "$address" } } },
      { $project: { _id: 0 } },
    ]).exec();

    const addressList = address[0]["address"];
    user.address = addressList;
  }

  await user.save();

  await myRedis.validateData(redisClient, `${userId}`);

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update customer successfully"
  );
});

userController.deleteCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const redisClient = myRedis.getConnection();

  let user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Found", "Delete User Error");

  if (user.isDeleted)
    throw new AppError(400, "User is already deleted", "Delete User Error");

  user = await User.findByIdAndUpdate(
    currentUserId,
    { isDeleted: true },
    { new: true }
  );

  await myRedis.validateData(redisClient, `${currentUserId}`);

  return sendResponse(res, 200, true, user, null, "Delete User Successfully");
});

userController.deleteSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const redisClient = await myRedis.getConnection();

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User Not Found", "Delete User Error");

  if (user.isDeleted)
    throw new AppError(400, "User Is Already Deleted", "Delete User Error");

  user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );

  await myRedis.validateData(redisClient, `${userId}`);

  return sendResponse(res, 200, true, user, null, "Delete User Successfully");
});

userController.deleteMultiUsers = catchAsync(async (req, res, next) => {
  let { usersIdDeleted } = req.query;
  usersIdDeleted = usersIdDeleted.split(",");
  const redisClient = await myRedis.getConnection();

  const promises = usersIdDeleted.map(async (userId) => {
    let user = await User.findById(userId);
    if (!user) throw new AppError(400, "User Not Found", "Delete User Error");

    if (user.isDeleted)
      throw new AppError(400, "User Is Already Deleted", "Delete User Error");

    let temp = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    return temp;
  });

  const usersDeleted = await Promise.all(promises);

  for (const userId of usersIdDeleted) {
    await myRedis.validateData(redisClient, `${userId}`);
  }

  return sendResponse(
    res,
    200,
    true,
    usersDeleted,
    null,
    "Delete User Successfully"
  );
});

userController.restoreUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const redisClient = await myRedis.getConnection();

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User Not Found", "Restore User Error");

  if (!user.isDeleted)
    throw new AppError(400, "User Is Active", "Restore User Error");

  const userRestore = await User.findByIdAndUpdate(
    userId,
    { isDeleted: false },
    { new: true }
  );

  await myRedis.validateData(redisClient, `${userId}`);

  return sendResponse(
    res,
    200,
    true,
    userRestore,
    null,
    "Restore User Successfully"
  );
});

userController.deletePernamentUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const redisClient = await myRedis.getConnection();

  let user = await User.findById(userId);
  if (!user)
    throw new AppError(400, "User Not Found", "Delete Pernament User Error");

  const userDeletePernament = await User.findByIdAndDelete(userId);

  await myRedis.validateData(redisClient, `${userId}`);

  return sendResponse(
    res,
    200,
    true,
    userDeletePernament,
    null,
    "Delete Pernament User Successfully"
  );
});

userController.deletePernamentMultiUsers = catchAsync(
  async (req, res, next) => {
    let { usersIdDeleted } = req.query;
    usersIdDeleted = usersIdDeleted.split(",");
    const redisClient = await myRedis.getConnection();

    const promises = usersIdDeleted.map(async (userId) => {
      let user = await User.findById(userId);
      if (!user)
        throw new AppError(
          400,
          "User Not Found",
          "Delete Pernament User Error"
        );

      let temp = await User.findByIdAndDelete(userId);
      return temp;
    });

    const usersDeleted = await Promise.all(promises);

    for (const userId of usersIdDeleted) {
      await myRedis.validateData(redisClient, `${userId}`);
    }

    return sendResponse(
      res,
      200,
      true,
      usersDeleted,
      null,
      "Delete Pernament User Successfully"
    );
  }
);

module.exports = userController;
