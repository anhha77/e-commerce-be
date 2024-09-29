const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const mongoose = require("mongoose");

const validators = {};
validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid Object Id");
  }
  return true;
};

validators.checkUsersIdField = (usersIdList) => {
  usersIdList = usersIdList.split(",");
  usersIdList.forEach((userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid Object Id");
    }
  });
  return true;
};

validators.checkAddressField = (value) => {
  value.forEach((address) => {
    if (!address.addressLocation || address.addressLocation.length === 0) {
      throw new Error("Invalid address location");
    }

    if (!address.country || address.country.length === 0) {
      throw new Error("Invalid country");
    }

    if (!address.phoneNumber || address.phoneNumber.length === 0) {
      throw new Error("Invalid phone number");
    }

    if (
      address.isDefault === undefined ||
      typeof address.isDefault !== "boolean"
    ) {
      throw new Error("Invalid value");
    }
  });
  return true;
};

module.exports = validators;
