require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("authorization")?.split(" ")[1];

    if (token !== req.cookies.auth) {
      throw { name: "OAuthTokenException", message: "Token missing." };
    }

    // verify a token
    const decoded = jwt.verify(req.cookies.auth, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id);

    req.auth = {
      user,
      token: req.cookies.auth,
      decoded,
    };
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
