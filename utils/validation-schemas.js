import Joi from 'joi';

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// MongoDB ObjectId pattern validation
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Expense validation schemas
const createExpenseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  amount: Joi.number().required().positive(),
  type: Joi.string().required().valid('income', 'expense'),
  category: Joi.string().required().pattern(objectIdPattern).message('Category must be a valid MongoDB ObjectId'),
  date: Joi.date(),
});

const updateExpenseSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  amount: Joi.number().positive(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().pattern(objectIdPattern).message('Category must be a valid MongoDB ObjectId'),
  date: Joi.date(),
}).min(1);

// Category validation schemas
const createCategorySchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  type: Joi.string().required().valid('income', 'expense'),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50),
  type: Joi.string().valid('income', 'expense'),
}).min(1);


export {
  registerSchema,
  loginSchema,
  createExpenseSchema,
  updateExpenseSchema,
  createCategorySchema,
  updateCategorySchema,
}; 