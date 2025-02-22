const express = require('express');
const router = express.Router();
const {register, login, resetPassword, verifyResetCode} = require("../controllers/Auth");
const { authenticate } = require("../middlewares/authenticate")


router.post("/register", register)
router.post("/login", login)
router.post("/reset-password", authenticate, resetPassword)
router.post("/verify-reset-password", verifyResetCode)

module.exports = router;