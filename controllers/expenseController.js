import { Category, Expense } from "../models/index.js";
import { StatusCodes } from 'http-status-codes';
import { expenseService } from '../services/index.js';
import { logger } from '../utils/logger.js';

const addExpense = async(req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body, req.userId);
        
        return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Expense added successfully",
            expense,
        });
    } catch (error) {
        logger.error('Error in addExpense controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to add expense",
        });
    }
}

const getExpenseByUser = async(req, res) => {
    try {
        const result = await expenseService.getExpensesByUser(req.userId, req.query);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses: result.expenses,
            pagination: result.pagination
        });
    } catch (error) {
        logger.error('Error in getExpenseByUser controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to get expenses",
        });
    }
}

const getExpenseById = async(req, res)=>{
    try {
        const expense = await expenseService.getExpenseById(req.params.id, req.userId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expense fetched successfully",
            expense,
        })

        // if(!expense){
        //     return res.status(404).json({
        //         success: false,
        //         message: "Expense not found",
        //     })
        // }

        // if(expense.user.toString() !== req.userId){
        //     return res.status(403).json({
        //         success: false,
        //         message: "You are not authorized to access this expense",
        //         error: "Unauthorized",
        //     })
        // }

        // return res.status(200).json({
        //     success: true,
        //     message: "Expense fetched successfully",
        //     expense,
        // })
        
    } catch (error) {
        logger.error('Error in getExpenseById controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to get expense",
        })
    }
}

const getUserExpenseByType = async(req, res) => {
    try {
        const { type } = req.query;

        const result = await expenseService.getExpensesByType(req.userId, type, req.query);
        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses: result.expenses,
            pagination: result.pagination
        });
    } catch (error) {
        logger.error('Error in getUserExpenseByType controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to get expenses by type",
        });
    }
}

const getExpenseByCategory = async(req, res) => {
    try {
        const { category } = req.query;
        
        const result = await expenseService.getExpensesByCategory(req.userId, category, req.query);
        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses: result.expenses,
            pagination: result.pagination
        });
    } catch (error) {
        logger.error('Error in getExpenseByCategory controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to get expenses by category",
        });
    }
}

const getExpenseByDateRange = async(req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const result = await expenseService.getExpensesByDateRange(
            req.userId, 
            { startDate, endDate },
            req.query
        );
        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses: result.expenses,
            pagination: result.pagination
        });
    } catch (error) {
        logger.error('Error in getExpenseByDateRange controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to get expenses by date range",
        });
    }
}

const updateExpense = async(req, res) => {
    try {
        const expenseId = req.params.id;
        const updatedExpense = await expenseService.updateExpense(expenseId, req.body, req.userId);
        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense,
        });
    } catch (error) {
        logger.error('Error in updateExpense controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to update expense",
        });
    }
}

const deleteExpense = async(req, res) => {
    try {
        const expenseId = req.params.id;
        const deletedExpense = await expenseService.deleteExpense(expenseId, req.userId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Expense deleted successfully",
            expense: deletedExpense,
        });
    } catch (error) {
        logger.error('Error in deleteExpense controller:', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to delete expense",
        });
    }
}

const ExpenseController = {
    addExpense,
    getExpenseByUser,
    getExpenseById,
    getUserExpenseByType,
    getExpenseByCategory,
    getExpenseByDateRange,
    updateExpense,
    deleteExpense,
}

export default ExpenseController;
