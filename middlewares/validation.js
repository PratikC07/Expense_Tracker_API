import { StatusCodes } from 'http-status-codes';
import { validationSchemas } from '../utils/index.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation error',
      errors: errorMessages,
    });
  }

  next();
};
//Create validation middleware methods for auth
const validateSignup = validate(validationSchemas.registerSchema);
const validateLogin = validate(validationSchemas.loginSchema);

// Create validation middleware methods that match the existing API
const validateCreateExpense = validate(validationSchemas.createExpenseSchema);
const validateUpdateExpense = validate(validationSchemas.updateExpenseSchema);

// Create validation middleware methods for category
const validateCreateCategory = validate(validationSchemas.createCategorySchema);
const validateUpdateCategory = validate(validationSchemas.updateCategorySchema);


// Placeholder for other validation methods that need to be implemented
const validateExpenseId = (req, res, next) => next();
const validateTypeQuery = (req, res, next) => next();
const validateCategoryQuery = (req, res, next) => next();
const validateDateRange = (req, res, next) => next();

const validationMiddleware = {
  validateSignup,
  validateLogin,
  validateCreateExpense,
  validateUpdateExpense,
  validateCreateCategory,
  validateUpdateCategory,
  validateExpenseId,
  validateTypeQuery,
  validateCategoryQuery,
  validateDateRange,
};

export default validationMiddleware; 