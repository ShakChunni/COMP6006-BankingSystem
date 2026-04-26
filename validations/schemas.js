const Joi = require("joi");

const registerSchema = Joi.object({
  customerId: Joi.string().trim().max(100).required().messages({
    "string.empty": "Customer ID is required.",
    "any.required": "Customer ID is required.",
    "string.max": "Customer ID must be at most 100 characters.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
  }),
  address: Joi.string().allow("").max(200),
  phone: Joi.string().allow("").max(30),
});

const loginSchema = Joi.object({
  customerId: Joi.string().trim().required().messages({
    "string.empty": "Customer ID is required.",
    "any.required": "Customer ID is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

const accountSchema = Joi.object({
  accountType: Joi.string().required().messages({
    "string.empty": "Account type is required.",
    "any.required": "Account type is required.",
  }),
  initialBalance: Joi.number().min(0).optional().messages({
    "number.base": "Initial balance must be a valid number.",
    "number.min": "Initial balance cannot be negative.",
  }),
});

const transactionSchema = Joi.object({
  type: Joi.string().valid("credit", "debit").required().messages({
    "any.only": "Transaction type must be credit or debit.",
    "any.required": "Transaction type is required.",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a valid number.",
    "number.positive": "Amount must be greater than zero.",
    "any.required": "Amount is required.",
  }),
  description: Joi.string().allow("").max(120),
  reference: Joi.string().allow("").max(120),
});

const transferSchema = Joi.object({
  type: Joi.string().valid("transfer").required().messages({
    "any.only": "Transaction type must be transfer.",
    "any.required": "Transaction type is required.",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a valid number.",
    "number.positive": "Amount must be greater than zero.",
    "any.required": "Amount is required.",
  }),
  toAccountId: Joi.string().required().messages({
    "string.empty": "Destination account is required.",
    "any.required": "Destination account is required.",
  }),
  description: Joi.string().allow("").max(120),
  reference: Joi.string().allow("").max(120),
});

const profileSchema = Joi.object({
  address: Joi.string().allow("").max(200).messages({
    "string.max": "Address must be at most 200 characters.",
  }),
  phone: Joi.string().allow("").max(30).messages({
    "string.max": "Phone must be at most 30 characters.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  accountSchema,
  transactionSchema,
  transferSchema,
  profileSchema,
};
