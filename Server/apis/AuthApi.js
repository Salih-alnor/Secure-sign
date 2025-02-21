const express = require('express');
const router = express.Router();
const {register, login, resetPassword, verifyResetCode} = require("../controllers/Auth")


router.post("/register", register)
router.post("/login", login)
router.post("/reset-password", resetPassword)
router.post("/verify-reset-password", verifyResetCode)

module.exports = router;