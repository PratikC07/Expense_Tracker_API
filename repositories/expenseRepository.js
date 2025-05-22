import { Expense } from '../models/index.js';

class ExpenseRepository {
  async findById(id) {
    return Expense.findById(id).populate('category').lean();
  }

  async findAll(filters = {}, options = {}) {
    const { limit = 10, page = 1, sort = { date: -1 } } = options;
    const skip = (page - 1) * limit;
    
    return {
      expenses: await Expense.find(filters)
        .populate('category')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      totalCount: await Expense.countDocuments(filters),
    };
  }

  async countDocuments(filters = {}) {
    return Expense.countDocuments(filters);
  }

  async findWithPagination(filters = {}, page = 1, limit = 10, sort = { date: -1 }) {
    const skip = (page - 1) * limit;
    
    return Expense.find(filters)
      .populate('category', 'name type')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async create(expenseData) {
    const expense = new Expense(expenseData);
    await expense.save();
    return expense.populate('category');
  }

  async update(id, expenseData) {
    return Expense.findByIdAndUpdate(id, expenseData, { new: true }).populate('category').lean();
  }

  async delete(id) {
    return Expense.findByIdAndDelete(id).lean();
  }

  async getSummaryByType(userId, dateRange = {}) {
    const matchStage = { user: userId };
    
    if (dateRange.startDate && dateRange.endDate) {
      matchStage.date = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate),
      };
    }
    
    return Expense.aggregate([
      { $match: matchStage },
      { $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      }},
      { $project: {
        _id: 0,
        type: '$_id',
        total: 1,
        count: 1,
      }},
    ]);
  }

  async getSummaryByCategory(userId, dateRange = {}) {
    const matchStage = { user: userId };
    
    if (dateRange.startDate && dateRange.endDate) {
      matchStage.date = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate),
      };
    }
    
    return Expense.aggregate([
      { $match: matchStage },
      { $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      }},
      { $lookup: {
        from: 'categories',
        localField: '_id.category',
        foreignField: '_id',
        as: 'categoryDetails',
      }},
      { $unwind: '$categoryDetails' },
      { $project: {
        _id: 0,
        type: '$_id.type',
        category: '$categoryDetails.name',
        total: 1,
        count: 1,
      }},
    ]);
  }
}

export default new ExpenseRepository(); 