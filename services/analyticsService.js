import { Expense } from '../models/index.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

/**
 * Get summary of financial data (income, expenses, balance)
 * @param {string} userId - User ID 
 * @param {Object} period - Period object with startDate and endDate
 * @returns {Object} Summary object with totalIncome, totalExpenses, balance
 */
const getFinancialSummary = async (userId, period = {}) => {
  try {
    const { startDate, endDate } = period;
    const query = { user: new mongoose.Types.ObjectId(userId) };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Aggregate to get total income and expenses
    const summaryData = await Expense.aggregate([
      { $match: query },
      { 
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        } 
      }
    ]);

    // Extract income and expense totals
    const totalIncome = summaryData.find(item => item._id === 'income')?.total || 0;
    const totalExpenses = summaryData.find(item => item._id === 'expense')?.total || 0;
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
      period: {
        startDate: startDate || 'all-time',
        endDate: endDate || 'present'
      }
    };
  } catch (error) {
    logger.error('Error in getFinancialSummary:', error);
    throw error;
  }
};

/**
 * Get spending breakdown by category
 * @param {string} userId - User ID
 * @param {Object} period - Period object with startDate and endDate
 * @param {string} type - Transaction type (income/expense)
 * @returns {Array} Categories with spending amounts and percentages
 */
const getCategoryBreakdown = async (userId, period = {}, type = 'expense') => {
  try {
    const { startDate, endDate } = period;
    const query = { user: new mongoose.Types.ObjectId(userId), type };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Aggregate to get spending by category
    const categoryData = await Expense.aggregate([
      { $match: query },
      { 
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$categoryDetails.name',
          amount: 1,
          count: 1
        }
      },
      { $sort: { amount: -1 } }
    ]);

    // Calculate total to get percentages
    const total = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    
    // Add percentage to each category
    const categoriesWithPercentage = categoryData.map(category => ({
      ...category,
      percentage: total > 0 ? (category.amount / total * 100).toFixed(2) : 0
    }));

    return {
      total,
      categories: categoriesWithPercentage
    };
  } catch (error) {
    logger.error('Error in getCategoryBreakdown:', error);
    throw error;
  }
};

/**
 * Get monthly spending trends
 * @param {string} userId - User ID
 * @param {number} months - Number of months to include
 * @returns {Array} Monthly summaries
 */
const getMonthlyTrends = async (userId, months = 6) => {
  try {
    // Calculate start date (n months ago)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const query = { 
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate }
    };

    // Aggregate to get monthly totals by type
    const monthlyData = await Expense.aggregate([
      { $match: query },
      {
        $project: {
          type: 1,
          amount: 1,
          month: { $month: '$date' },
          year: { $year: '$date' }
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year',
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format the results into month-by-month structure
    const monthlyTrends = [];
    const processedMonths = new Set();

    monthlyData.forEach(item => {
      const monthKey = `${item._id.year}-${item._id.month}`;
      const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' });
      
      let monthObj;
      if (!processedMonths.has(monthKey)) {
        monthObj = {
          month: item._id.month,
          year: item._id.year,
          monthName,
          income: 0,
          expense: 0,
          balance: 0
        };
        monthlyTrends.push(monthObj);
        processedMonths.add(monthKey);
      } else {
        monthObj = monthlyTrends.find(m => m.month === item._id.month && m.year === item._id.year);
      }

      // Add income or expense amount
      if (item._id.type === 'income') {
        monthObj.income = item.total;
      } else if (item._id.type === 'expense') {
        monthObj.expense = item.total;
      }
      
      // Calculate balance
      monthObj.balance = monthObj.income - monthObj.expense;
    });

    return monthlyTrends;
  } catch (error) {
    logger.error('Error in getMonthlyTrends:', error);
    throw error;
  }
};

/**
 * Detect unusual spending patterns
 * @param {string} userId - User ID
 * @returns {Array} List of anomalies detected
 */
const detectAnomalies = async (userId) => {
  try {
    // Get user's average spending per category
    const threeMothsAgo = new Date();
    threeMothsAgo.setMonth(threeMothsAgo.getMonth() - 3);
    
    const query = { 
      user: new mongoose.Types.ObjectId(userId),
      type: 'expense',
      date: { $gte: threeMothsAgo }
    };

    // Calculate average monthly spending per category
    const categoryAverages = await Expense.aggregate([
      { $match: query },
      {
        $project: {
          category: 1,
          amount: 1,
          month: { $month: '$date' },
          year: { $year: '$date' }
        }
      },
      {
        $group: {
          _id: {
            category: '$category',
            month: '$month',
            year: '$year'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          avgMonthlySpend: { $avg: '$total' },
          months: { $push: { month: '$_id.month', year: '$_id.year', total: '$total' } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          categoryName: '$categoryDetails.name',
          avgMonthlySpend: 1,
          months: 1
        }
      }
    ]);

    // Find anomalies (50% above average)
    const anomalies = [];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    categoryAverages.forEach(category => {
      const currentMonthData = category.months.find(
        m => m.month === currentMonth && m.year === currentYear
      );
      
      if (currentMonthData && currentMonthData.total > category.avgMonthlySpend * 1.5) {
        anomalies.push({
          category: category.categoryName,
          currentSpending: currentMonthData.total,
          averageSpending: category.avgMonthlySpend,
          percentageIncrease: ((currentMonthData.total / category.avgMonthlySpend - 1) * 100).toFixed(2)
        });
      }
    });

    return anomalies;
  } catch (error) {
    logger.error('Error in detectAnomalies:', error);
    throw error;
  }
};

/**
 * Generate basic insights about user's financial behavior
 * @param {string} userId - User ID
 * @returns {Object} Insights object
 */
const generateInsights = async (userId) => {
  try {
    // Get current month data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const summary = await getFinancialSummary(userId, {
      startDate: startOfMonth,
      endDate: new Date()
    });
    
    const categoryBreakdown = await getCategoryBreakdown(userId, {
      startDate: startOfMonth,
      endDate: new Date()
    });
    
    const trends = await getMonthlyTrends(userId, 3);
    const anomalies = await detectAnomalies(userId);
    
    // Generate basic insights
    const insights = {
      summary: {
        message: summary.balance >= 0 
          ? `You're in the positive this month by $${summary.balance}` 
          : `You're in the negative this month by $${Math.abs(summary.balance)}`
      },
      topSpending: {
        category: categoryBreakdown.categories[0]?.categoryName || 'No data',
        amount: categoryBreakdown.categories[0]?.amount || 0,
        message: `Your highest spending category is ${categoryBreakdown.categories[0]?.categoryName || 'None'}`
      },
      trend: {
        message: trends.length > 1 && trends[trends.length - 1].balance > trends[trends.length - 2].balance
          ? 'Your savings are improving compared to last month'
          : 'Your savings have decreased compared to last month'
      },
      anomalies: {
        count: anomalies.length,
        message: anomalies.length > 0
          ? `We detected ${anomalies.length} unusual spending patterns this month`
          : 'No unusual spending detected this month'
      }
    };
    
    return insights;
  } catch (error) {
    logger.error('Error in generateInsights:', error);
    throw error;
  }
};

const analyticsService = {
  getFinancialSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  detectAnomalies,
  generateInsights
}; 

export default analyticsService;