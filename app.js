const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// database connection
database().catch((error) => {
  console.log(error);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse cookie
app.use(cookieParser());

// enable cors
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

module.exports = app;
