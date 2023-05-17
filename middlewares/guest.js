require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("authorization")?.split(" ")[1];

    if (req.cookies.auth != null && token === req.cookies.auth) {
      throw { name: "MiddlewareException", message: "User already logged in." };
    }
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        ...error,
        code: 401,
      },
    });
  }
};
