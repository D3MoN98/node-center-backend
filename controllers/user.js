const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find();

      res.status(200).json({
        data: users,
      });
    } catch (error) {
      res.status(404).json({
        error: error,
      });
    }
  },

  show: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        error: error,
      });
    }
  },

  store: async (req, res, next) => {
    try {
      const { name, email, contact_no, password } = req.body;
      const user = await User.create({ name, email, contact_no, password });

      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(422).json({
        error: error,
      });
    }
  },

  update: async (req, res, next) => {
    try {
      const { name, email, contact_no } = req.body;
      const user = await User.updateOne(
        { _id: req.params.id },
        { name, email, contact_no }
      );

      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(422).json({
        error: error,
      });
    }
  },

  destroy: (req, res, next) => {
    res.status(200).json({
      body: req.body.name,
    });
  },
};
