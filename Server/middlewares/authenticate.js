const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../database/User");

/*
 * @route POST /api/v1/auth/authenticate
 * @desc Reset password
 * @access Private [user]
 */

const authenticate = asyncHandler(async (req, res, next) => {
  // 1- check if token is exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    const error = new Error("Not authenticated, token is required.");
    error.statusCode = 401;
    return next(error);
  }
  // 2- check if token is valid
  const decoded = jwt.verify(token, "jwt-token");

  if (!decoded) {
    const error = new Error("Not authenticated, invalid token.");
    error.statusCode = 401;
    return next(error);
  }
  // 3- check if user is found

  // 4- check if user is authorized to access this page
  req.user = await getUserById(decoded.userId);
  if (!req.user) {
    const error = new Error("Not authenticated, user not found.");
    error.statusCode = 403;
    return next(error);
  }
  // 5- if user is authorized, send response with user data

  next();
});

const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const user = await getUserById(req.user.id);

    if (!roles.includes(user.roles)) {
      const error = new Error(
        "Not authorized, Is not allowed to access this page"
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  });

module.exports = {
  authenticate,
  authorize,
};
