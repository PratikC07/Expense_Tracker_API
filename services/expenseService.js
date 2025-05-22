import { expenseRepository, categoryRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';
import { StatusCodes } from 'http-status-codes';


class ExpenseService {
  async getExpenses(userId, query = {}) {
    try {
      const { page = 1, limit = 10, type, startDate, endDate, category } = query;

      const filters = { user: userId };

      if (type) filters.type = type;
      if (category) filters.category = category;

      if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate);
        if (endDate) filters.date.$lte = new Date(endDate);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { date: -1 },
      };

      const { expenses, totalCount } = await expenseRepository.findAll(filters, options);

      return {
        expenses,
        pagination: {
          total: totalCount,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(totalCount / options.limit),
        },
      };
    } catch (error) {
      logger.error('Error in getExpenses service:', error);
      throw error;
    }
  }

  async getExpensesByUser(userId, query = {}) {
    try {
      // Pagination parameters
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      // Sorting parameters
      const sortBy = query.sortBy || 'date';
      const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      // Count total documents for pagination metadata
      const totalExpenses = await expenseRepository.countDocuments({ user: userId });

      // Get expenses with pagination, sorting, and populate category
      const expenses = await expenseRepository.findWithPagination(
        { user: userId },
        page,
        limit,
        sortOptions
      );

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalExpenses / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        expenses,
        pagination: {
          totalExpenses,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Error in getExpensesByUser service:', error);
      throw error;
    }
  }

  async getExpenseById(id, userId) {
    try {
      const expense = await expenseRepository.findById(id);

      if (!expense) {
        const error = new Error('Expense not found');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      if (expense.user.toString() !== userId.toString()) {
        const error = new Error('Not authorized');
        error.statusCode = StatusCodes.FORBIDDEN;
        throw error;
      }

      return expense;
    } catch (error) {
      logger.error('Error in getExpenseById service:', error);
      throw error;
    }
  }

  async createExpense(expenseData, userId) {
    try {
      const { title, amount, type, category, date } = expenseData;

      // Verify the category exists and user has access to it
      const existingCategory = await categoryRepository.findById(category);

      if (!existingCategory) {
        const error = new Error('Category not found');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      // Verify user has access to this category (either it's a system category or user's own)
      if (existingCategory.user && existingCategory.user.toString() !== userId.toString()) {
        const error = new Error('Not authorized to use this category');
        error.statusCode = StatusCodes.FORBIDDEN;
        throw error;
      }

      // Create expense with the provided category ID
      const expense = await expenseRepository.create({
        title,
        amount,
        type,
        category: existingCategory._id,
        date: date || new Date(),
        user: userId,
      });

      return expense;
    } catch (error) {
      logger.error('Error in createExpense service:', error);
      throw error;
    }
  }

  async updateExpense(id, expenseData, userId) {
    try {
      if (!expenseData || Object.keys(expenseData).length === 0) {
        const error = new Error('No update data provided');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
      }

      // Check if expense exists and belongs to user
      const existingExpense = await this.getExpenseById(id, userId);

      // If we are changing expense category, verify it exists and user has access
      let categoryId = existingExpense.category._id;
      if (expenseData.category) {
        const existingCategory = await categoryRepository.findById(expenseData.category);

        if (!existingCategory) {
          const error = new Error('Category not found');
          error.statusCode = StatusCodes.NOT_FOUND;
          throw error;
        }

        // Verify user has access to this category (either it's a system category or user's own)
        if (existingCategory.user && existingCategory.user.toString() !== userId.toString()) {
          const error = new Error('Not authorized to use this category');
          error.statusCode = StatusCodes.FORBIDDEN;
          throw error;
        }

        categoryId = existingCategory._id;

        //if we are changing the type, we need to check if the new type is valid according to the category
        //if we are not changing the type, we need to check if the new type is valid according to the category
      
        if (expenseData.type) {
          if (expenseData.type !== existingCategory.type) {
            const error = new Error('Type not allowed for this category');
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
          }
        } else if (existingCategory.type !== existingExpense.type) {
          const error = new Error('Type not allowed for this category');
          error.statusCode = StatusCodes.BAD_REQUEST;
          throw error;
        }
      } else {
        if (expenseData.type) {
          if (expenseData.type !== existingExpense.category.type) {
            const error = new Error('Type not allowed for this category');
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
          }
        }


      }



      // Update expense with validated data
      const updatedExpenseData = { ...expenseData };
      if (expenseData.category) {
        updatedExpenseData.category = categoryId;
      }

      // Update expense
      const updatedExpense = await expenseRepository.update(id, updatedExpenseData);

      return updatedExpense;
    } catch (error) {
      logger.error('Error in updateExpense service:', error);
      throw error;
    }
  }

  async deleteExpense(id, userId) {
    try {
      // First check if expense exists and belongs to user
      await this.getExpenseById(id, userId);

      // Delete expense
      const deletedExpense = await expenseRepository.delete(id);

      if (!deletedExpense) {
        const error = new Error('Expense not found');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      return deletedExpense;
    } catch (error) {
      logger.error('Error in deleteExpense service:', error);
      throw error;
    }
  }

  async getExpenseSummary(userId, query = {}) {
    try {
      const { startDate, endDate } = query;
      const dateRange = {};

      if (startDate) dateRange.startDate = startDate;
      if (endDate) dateRange.endDate = endDate;

      const typesSummary = await expenseRepository.getSummaryByType(userId, dateRange);
      const categorySummary = await expenseRepository.getSummaryByCategory(userId, dateRange);

      // Calculate total income and expenses
      let totalIncome = 0;
      let totalExpense = 0;

      typesSummary.forEach(summary => {
        if (summary.type === 'income') {
          totalIncome = summary.total;
        } else if (summary.type === 'expense') {
          totalExpense = summary.total;
        }
      });

      return {
        summary: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        },
        byType: typesSummary,
        byCategory: categorySummary,
      };
    } catch (error) {
      logger.error('Error in getExpenseSummary service:', error);
      throw error;
    }
  }

  async getExpensesByType(userId, type, query = {}) {
    try {
      if (!type) {
        const error = new Error('Type is required');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
      }

      // Pagination parameters
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      // Sorting parameters
      const sortBy = query.sortBy || 'date';
      const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      // Set up filters
      const filters = {
        user: userId,
        type: type
      };

      // Count total documents for pagination metadata
      const totalExpenses = await expenseRepository.countDocuments(filters);

      // Get expenses with pagination, sorting, and populate category
      const expenses = await expenseRepository.findWithPagination(
        filters,
        page,
        limit,
        sortOptions
      );

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalExpenses / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        expenses,
        pagination: {
          totalExpenses,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Error in getExpensesByType service:', error);
      throw error;
    }
  }

  async getExpensesByCategory(userId, categoryId, query = {}) {
    try {
      if (!categoryId) {
        const error = new Error('Category is required');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
      }

      // Pagination parameters
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      // Sorting parameters
      const sortBy = query.sortBy || 'date';
      const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      // Set up filters
      const filters = {
        user: userId,
        category: categoryId
      };

      // Count total documents for pagination metadata
      const totalExpenses = await expenseRepository.countDocuments(filters);

      // Get expenses with pagination, sorting, and populate category
      const expenses = await expenseRepository.findWithPagination(
        filters,
        page,
        limit,
        sortOptions
      );

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalExpenses / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        expenses,
        pagination: {
          totalExpenses,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Error in getExpensesByCategory service:', error);
      throw error;
    }
  }

  async getExpensesByDateRange(userId, dateRange, query = {}) {
    try {
      const { startDate, endDate } = dateRange;

      if (!startDate || !endDate) {
        const error = new Error('Start date and end date are required');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
      }

      // Pagination parameters
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      // Sorting parameters
      const sortBy = query.sortBy || 'date';
      const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      // Set up filters
      const filters = {
        user: userId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        }
      };

      // Count total documents for pagination metadata
      const totalExpenses = await expenseRepository.countDocuments(filters);

      // Get expenses with pagination, sorting, and populate category
      const expenses = await expenseRepository.findWithPagination(
        filters,
        page,
        limit,
        sortOptions
      );

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalExpenses / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        expenses,
        pagination: {
          totalExpenses,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      logger.error('Error in getExpensesByDateRange service:', error);
      throw error;
    }
  }
}

export default new ExpenseService(); 