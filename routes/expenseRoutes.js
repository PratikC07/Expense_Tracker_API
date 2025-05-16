import express from "express";
import { ExpenseController } from "../controllers/index.js";
import { authMiddleware, validationMiddleware } from "../middlewares/index.js";

const router = express.Router();

// Add expense with validation
router.post(
    "/add-expense", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateCreateExpense,
    ExpenseController.addExpense
);

// Get expenses by user
router.get(
    "/get-expense-by-user", 
    authMiddleware.verifyToken, 
    ExpenseController.getExpenseByUser
);

// Get expense by ID with validation
router.get(
    "/get-expense-by-id/:id", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateExpenseId,
    ExpenseController.getExpenseById
);

// Get expense by type with validation
router.get(
    "/get-expense-by-type", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateTypeQuery,
    ExpenseController.getUserExpenseByType
);

// Get expense by category with validation
router.get(
    "/get-expense-by-category", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateCategoryQuery,
    ExpenseController.getExpenseByCategory
);

// Get expense by date range with validation
router.get(
    "/get-expense-by-date-range", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateDateRange,
    ExpenseController.getExpenseByDateRange
);

// Update expense with validation
router.put(
    "/update-expense/:id", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateUpdateExpense,
    ExpenseController.updateExpense
);

// Delete expense with validation
router.delete(
    "/delete-expense/:id", 
    authMiddleware.verifyToken, 
    validationMiddleware.validateExpenseId,
    ExpenseController.deleteExpense
);

export default router;