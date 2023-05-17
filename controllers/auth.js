const User = require("../models/user");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const mail = require("../config/mail");
const validator = require("validator");
const ForgetPassword = require("../models/forget-password");

require("dotenv").config();

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.login(email, password);

      // token generate
      const token = jwt.sign(
        {
          email: email,
          id: user._id,
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: 60 * 5,
        }
      );
      res.cookie("auth", token, {
        maxAge: 1000 * 60 * process.env.JWT_EXPIRE,
      });
      res.status(200).json({
        data: user,
        token: token,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  logout: (req, res, next) => {
    try {
      res.clearCookie("auth");
      res.status(200).json({
        data: { message: "Logout successfull" },
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  profile: (req, res, next) => {
    res.status(200).json(req.auth);
  },

  forgeatPassword: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw {
          name: "NotFoundException",
          message: "User not found with this email",
        };
      }
      const token = await jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: 60 * process.env.JWT_EXPIRE,
        }
      );
      const forgetPassword = await ForgetPassword.findOneAndUpdate(
        { email: user.email },
        { email: user.email, token },
        { upsert: true, new: true }
      );

      await mail.sendMail({
        from: "sjgalaxy98@gmail.com",
        to: "sjgalaxy98@gmail.com",
        subject: "NodeCenter Password Reset",
        template: "forget-password",
        context: {
          token: forgetPassword.token,
          name: user.name,
        },
      });

      res.status(200).json({
        data: {
          message: "A token has been send to your email address",
        },
      });
    } catch (error) {
      res.status(404).json({
        error: {
          ...error,
          code: 404,
        },
      });
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, password, confirm_password } = req.body;

      const decoded = await jwt.verify(token, process.env.JWT_TOKEN);
      const forgetPassword = await ForgetPassword.findOne({
        email: decoded.email,
        token,
      });
      if (!forgetPassword) {
        throw { message: "Token is invalid" };
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { password: await User.hashPassword(password) },
        { runValidators: true, new: true }
      );
      res.status(200).json({
        data: {
          message: "Password has been reset",
        },
      });
    } catch (error) {
      res.status(404).json({
        error: {
          ...error,
          code: 404,
        },
      });
    }
  },
};
