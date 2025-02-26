const {
  createUser,
  getUserByEmail,
  getResetCode,
  getValidResetCode,
  updateUserPassword,
} = require("../database/User");
const { registerSchema, loginSchema } = require("../validators/AuthValidator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

/*
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public [user - admin]
 * @param {String} user_name
 * @param {String} email_address
 * @param {String} password
 */
const register = asyncHandler(async (req, res, next) => {
  const { user_name, email_address, password } = req.body;
  // 1- validate user data
  const { error } = registerSchema.validate(req.body);

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  // 2- Check if user already exists
  const existingUser = await getUserByEmail(email_address);
  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    return next(err);
  }

  // 3- create user ID
  const userId = Date.now().toString();

  // 4- hash user password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5- create new user record
  await createUser(userId, user_name, email_address, hashedPassword);

  // 6- generate JWT token
  const token = jwt.sign({ userId }, "jwt-token");

  // 7- send response
  res.status(201).json({
    Status: "Success",
    message: "User registered successfully",
    userInfo: {
      user_name,
      email_address,
    },
    token,
  });
});

/*
 * @route POST /api/v1/auth/login
 * @desc Login a user
 * @access Public [user - admin]
 * @param {String} email_address
 * @param {String} password
 */
const login = asyncHandler(async (req, res, next) => {
  const { email_address, password } = req.body;
  // 1- validate user data
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  // 2- check if user exists
  const user = await getUserByEmail(email_address);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    return next(error);
  }

  // 3- compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    return next(error);
  }

  // 4- generate JWT token
  const token = jwt.sign({ userId: user.id }, "jwt-token");

  // 5- successfull login
  res.status(200).json({
    Status: "Success",
    message: "User logged in successfully",
    userInfo: {
      user_name: user.user_name,
      email_address: user.email_address,
    },
    token,
  });
});

/*
 * @route POST /api/v1/auth/forgot-password
 * @desc Send email with reset code
 * @access Private [user]
 * @param {String} email_address
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email_address } = req.body;
  // 1- check if user is exsist
  const user = await getUserByEmail(email_address);

  if (!user) {
    const error = new Error("This email is not exsist.");
    error.statusCode = 404;
    return next(error);
  }

  // 2- generate a random of 6 numbers and add in database
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedResetCode = await bcrypt.hash(resetCode, 10);
  const result = await getResetCode(user.id, hashedResetCode);

  if (result.err || !result) {
    const error = new Error("Failed to save reset code.");
    error.statusCode = 500;
    return next(error);
  }

  // 3- send email with reset code
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "salihalnor1996@gmail.com",
      pass: "qfdd alyg eydi yghr",
    },
  });

  const message = `Hello [${user.user_name}],
  We have received a request to reset your account password. If it was you who requested it,
  please click the button below to reset your password:

  ${resetCode}

  If it was not you who requested a password reset, 
  this message will be ignored, and nothing will be changed in your account.
  `;

  const mailOptions = {
    from: "Secure-sign",
    to: email_address,
    subject: "Reset your account password",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to send email." });
    }

    res
      .status(200)
      .json({ Status: "Success", message: "sent a reset-code to email." });
  });
});

/*
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password
 * @access Private [user]
 * @param {String} email_address
 * @param {String} reset_code
 */
const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email_address, reset_code } = req.body;
  // 1- check if user is exsist
  const user = await getUserByEmail(email_address);
  if (!user) {
    const error = new Error("This email is not exsist.");
    error.statusCode = 404;
    return next(error);
  }
  // 2- check if reset code is valid
  const hashedResetCode = await getValidResetCode(email_address);
  // console.log(hashedResetCode)
  if (
    !hashedResetCode.resetCode ||
    !(await bcrypt.compare(reset_code, hashedResetCode.resetCode))
  ) {
    const error = new Error("Invalid reset code.");
    error.statusCode = 400;
    return next(error);
  }
  res.status(200).json({ Status: "Success", message: "reset code is valid" });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { email_address, new_password } = req.body;
  // 1- check if user is exsist
  const user = await getUserByEmail(email_address);
  if (!user) {
    const error = new Error("This email is not exsist.");
    error.statusCode = 404;
    return next(error);
  }

  // 2- check if new password isn't same as old password
  const hashedOldPassword = user.password;
  const isSamePassword = await bcrypt.compare(new_password, hashedOldPassword);
  console.log(isSamePassword);
  if (isSamePassword) {
    const error = new Error("New password should not be same as old password.");
    error.statusCode = 400;
    return next(error);
  }

  // 3- hash user password
  const hashedNewPassword = await bcrypt.hash(new_password, 10);
  // 4- update user password in database
  const result = await updateUserPassword(email_address, hashedNewPassword);
  if (result.err || !result) {
    const error = new Error("Failed to update password.");
    error.statusCode = 500;
    return next(error);
  }
  res
    .status(200)
    .json({ Status: "Success", message: "Password updated successfully" });
});

module.exports = {
  register,
  login,
  resetPassword,
  verifyResetCode,
  updatePassword,
};
