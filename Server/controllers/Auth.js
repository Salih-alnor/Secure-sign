const { createUser, getUserByEmail } = require("../database/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { registerSchema, loginSchema } = require("../validators/AuthValidator");

/*
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 * @param {String} user_name
 * @param {String} email_address
 * @param {String} password
 */
const register = asyncHandler(async (req, res, next) => {
  const { user_name, email_address, password } = req.body;
  // 1- validate user data
  const { error } = registerSchema.validate(req.body);

  if (error) {
    const error = new Error(error.details[0].message);
    error.statusCode = 400;
    return next(error);
  }

  // 2- Check if user already exists
  const existingUser = await getUserByEmail(email_address);
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    return next(error);
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
 * @access Public
 * @param {String} email_address
 * @param {String} password
 */
const login = asyncHandler(async (req, res, next) => {
  const { email_address, password } = req.body;
  // 1- validate user data
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const error = new Error(error.details[0].message);
    error.statusCode = 400;
    return next(error);
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
    message: "User logged in successfully",
    userInfo: {
      user_name: user.user_name,
      email_address: user.email_address,
    },
    token,
  });
});

module.exports = {
  register,
  login,
};
