const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@clusternodecenter.b8v3ech.mongodb.net/?retryWrites=true&w=majority`
  );
};
