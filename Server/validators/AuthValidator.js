const Joi = require("joi");
// register Schema
const registerSchema = Joi.object({
  user_name: Joi.string()
    .min(3)
    .max(30)
    .required("user_name is not allowed to be empty"),
  email_address: Joi.string()
    .email()
    .required("email_address is not allowed to be empty"),
  password: Joi.string().min(8).required("password is not allowed to be empty"),
  confirm_password: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "password is not allowed to be empty",
    "any.only": "password must be matches",
  }),
});

// login Schema
const loginSchema = Joi.object({
  email_address: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
