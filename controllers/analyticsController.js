import { StatusCodes } from 'http-status-codes';
import analyticsService from '../services/analyticsService.js';
import { logger } from '../utils/logger.js';

/**
 * Get financial summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getFinancialSummary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    const period = {};
    if (startDate) period.startDate = startDate;
    if (endDate) period.endDate = endDate;
    
    const summary = await analyticsService.getFinancialSummary(userId, period);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Financial summary fetched successfully',
      data: summary
    });
  } catch (error) {
    logger.error('Error in getFinancialSummary controller:', error);
    next(error);
  }
};

/**
 * Get spending breakdown by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, type } = req.query;
    
    const period = {};
    if (startDate) period.startDate = startDate;
    if (endDate) period.endDate = endDate;
    
    const breakdown = await analyticsService.getCategoryBreakdown(userId, period, type);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category breakdown fetched successfully',
      data: breakdown
    });
  } catch (error) {
    logger.error('Error in getCategoryBreakdown controller:', error);
    next(error);
  }
};

/**
 * Get monthly spending trends
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { months = 6 } = req.query;
    
    const trends = await analyticsService.getMonthlyTrends(userId, parseInt(months));
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Monthly trends fetched successfully',
      data: trends
    });
  } catch (error) {
    logger.error('Error in getMonthlyTrends controller:', error);
    next(error);
  }
};

/**
 * Get spending anomalies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAnomalies = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const anomalies = await analyticsService.detectAnomalies(userId);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Spending anomalies fetched successfully',
      data: anomalies
    });
  } catch (error) {
    logger.error('Error in getAnomalies controller:', error);
    next(error);
  }
};

/**
 * Get personalized financial insights
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getInsights = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const insights = await analyticsService.generateInsights(userId);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Financial insights generated successfully',
      data: insights
    });
  } catch (error) {
    logger.error('Error in getInsights controller:', error);
    next(error);
  }
};

const analyticsController = {
  getFinancialSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getAnomalies,
  getInsights
}; 

export default analyticsController; 