const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const forgetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email is required",
    validate: [isEmail, "Email is invalid"],
  },
  token: { type: String, required: "Token is required" },
});

module.exports = mongoose.model("ForgetPassword", forgetPasswordSchema);
