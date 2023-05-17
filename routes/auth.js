const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const guestMiddleware = require("../middlewares/guest");

router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post(
  "/forget-password",
  guestMiddleware,
  authController.forgeatPassword
);
router.post("/reset-password", guestMiddleware, authController.resetPassword);
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
