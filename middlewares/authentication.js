const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      throw new AppError(401, "Login Required", "Authentication Error");

    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Token expired", "Authentication Error");
        } else {
          throw new AppError(401, "Token invalid", "Authentication Error");
        }
      }

      req.userId = payload._id;
      req.role = payload.role;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authentication.validateRole = (req, res, next, rolesRequired) => {
  try {
    let isAccess = false;
    const roleCurrentUser = req.role;
    rolesRequired.forEach((role) => {
      if (role === roleCurrentUser) {
        isAccess = true;
      }
    });

    if (!isAccess) {
      throw new AppError(401, "Missing required role", "Validate role error");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
