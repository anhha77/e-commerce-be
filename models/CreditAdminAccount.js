const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditAdminAccountSchema = Schema({
  account: { type: String, required: false },
  paymentMeyhod: { type: String, required: true },
});

const CreditAdminAccount = mongoose.model(
  "CreditAdminAccount",
  creditAdminAccountSchema,
  "CreditAccount"
);
module.exports = CreditAdminAccount;
