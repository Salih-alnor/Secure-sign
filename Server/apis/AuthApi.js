const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
  verifyResetCode,
  updatePassword,
} = require("../controllers/Auth");
const { authenticate, authorize } = require("../middlewares/authenticate");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password", verifyResetCode);
router.post("/update-password", updatePassword);

module.exports = router;
