import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all analytics routes
router.use(authMiddleware.verifyToken);

// Financial summary route
router.get('/summary', analyticsController.getFinancialSummary);

// Category breakdown route
router.get('/category-breakdown', analyticsController.getCategoryBreakdown);

// Monthly trends route
router.get('/monthly-trends', analyticsController.getMonthlyTrends);

// Anomalies detection route
router.get('/anomalies', analyticsController.getAnomalies);

// Financial insights route
router.get('/insights', analyticsController.getInsights);

export default router; 