const Joi = require("joi");
// register Schema
const registerSchema = Joi.object({
  user_name: Joi.string()
    .min(3)
    .max(30)
    .required().messages({
      "string.base": "user_name must be string",
      "string.min": "user_name must be at least 3 characters long",
      "string.max": "user_name must be at most 30 characters long",
      "string.empty": "user_name is not allowed to be empty",
      "any.required": "user_name is not allowed to be empty"
    }),
  email_address: Joi.string()
    .email()
    .required().messages({
      "string.email": "email_address must be a valid email address",
      "string.empty": "email_address is not allowed to be empty",
      "any.required": "email_address is not allowed to be empty"
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "password must be at least 8 characters long",
    "any.required": "password is not allowed to be empty"
  })
});

// login Schema
const loginSchema = Joi.object({
  email_address: Joi.string().email().required().messages({
    "string.email": "email_address must be a valid email address",
    "string.empty": "email_address is not allowed to be empty",
    "any.required": "email_address is not allowed to be empty"
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "password must be at least 8 characters long",
    "string.empty": "password is not allowed to be empty",
    "any.required": "password is not allowed to be empty"
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
