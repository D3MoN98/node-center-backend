const mongoose = require("mongoose");
const { isEmail, isMobilePhone, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: "Name is required" },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email is required",
    validate: [isEmail, "Email is invalid"],
  },
  contact_no: {
    type: String,
    required: "Contact no is required",
    validate: [isMobilePhone, "Contact no is invalid"],
  },
  password: {
    type: String,
    required: "Password is required",
    validate: [isStrongPassword, "Password should be a strong password"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email: email }).select(
      "name email password"
    );
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return { name: user.name, email: user.email };
      }
      throw {
        message: "Credentials not matched.",
        type: "AuthException",
        code: 400,
      };
    }
    throw {
      message: "Credentials not matched.",
      type: "AuthException",
      code: 400,
    };
  } catch (error) {
    throw { message: "something went wrong", code: 500 };
  }
};

module.exports = mongoose.model("User", userSchema);
