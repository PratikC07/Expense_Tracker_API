import { body, query, param, validationResult } from 'express-validator';

// Helper function to check for validation errors
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

// Validate create expense request
const validateCreateExpense = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
    
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom(value => value > 0).withMessage('Amount must be greater than 0'),
    
    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID format'),
    
    body('type')
        .notEmpty().withMessage('Type is required')
        .isIn(['income', 'expense']).withMessage('Type must be either "income" or "expense"'),
    
    body('date')
        .optional()
        .isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)'),
    
    validateResults
];

// Validate update expense request
const validateUpdateExpense = [
    param('id')
        .isMongoId().withMessage('Invalid expense ID format'),
    
    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
    
    body('amount')
        .optional()
        .isNumeric().withMessage('Amount must be a number')
        .custom(value => value > 0).withMessage('Amount must be greater than 0'),
    
    body('category')
        .optional()
        .isMongoId().withMessage('Invalid category ID format'),
    
    body('type')
        .optional()
        .isIn(['income', 'expense']).withMessage('Type must be either "income" or "expense"'),
    
    body('date')
        .optional()
        .isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)'),
    
    validateResults
];

// Validate get expense by date range
const validateDateRange = [
    query('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be in ISO8601 format (YYYY-MM-DD)'),
    
    query('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be in ISO8601 format (YYYY-MM-DD)')
        .custom((endDate, { req }) => {
            return new Date(endDate) >= new Date(req.query.startDate);
        }).withMessage('End date must be after or equal to start date'),
    
    validateResults
];

// Validate expense ID parameter
const validateExpenseId = [
    param('id')
        .isMongoId().withMessage('Invalid expense ID format'),
    
    validateResults
];

// Validate category parameter
const validateCategoryQuery = [
    query('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID format'),
    
    validateResults
];

// Validate type parameter
const validateTypeQuery = [
    query('type')
        .notEmpty().withMessage('Type is required')
        .isIn(['income', 'expense']).withMessage('Type must be either "income" or "expense"'),
    
    validateResults
];

const validationMiddleware = {
    validateCreateExpense,
    validateUpdateExpense,
    validateDateRange,
    validateExpenseId,
    validateCategoryQuery,
    validateTypeQuery
};

export default validationMiddleware; 