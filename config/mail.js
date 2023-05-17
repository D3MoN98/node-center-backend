const nodemailer = require("nodemailer");
const path = require("path");
const express = require("express");
var hbs = require("nodemailer-express-handlebars");
const viewPath = path.resolve("./views/email/template");
// const partialsPath = path.resolve("./views/email/template/partials");

require("dotenv").config();

const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

mail.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      layoutsDir: viewPath,
      defaultLayout: false,
      // partialsDir: partialsPath,
      express,
    },
    //View path declare
    viewPath: viewPath,
    extName: ".hbs",
  })
);

module.exports = mail;
