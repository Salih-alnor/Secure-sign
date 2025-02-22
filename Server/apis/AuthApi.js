const express = require('express');
const router = express.Router();
const {register, login, resetPassword, verifyResetCode} = require("../controllers/Auth");
const { authenticate, authorize } = require("../middlewares/authenticate")


router.post("/register", register)
router.post("/login", login)
router.post("/reset-password", authenticate, authorize('admin'), resetPassword)
router.post("/verify-reset-password", verifyResetCode)

module.exports = router;