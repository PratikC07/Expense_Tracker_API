import { Category } from '../models/index.js';
import { logger } from './logger.js';

const defaultCategories = [
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Other', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investment', type: 'income' },
  { name: 'Gift', type: 'income' },
];

const seedCategories = async () => {
  try {
    logger.info('Seeding default categories...');
    
    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name, user: null },
        cat,
        { upsert: true }
      );
    }
    
    logger.info('Default categories seeded successfully!!!');
  } catch (error) {
    logger.error('Error seeding default categories:', error);
  }
};

export { seedCategories }; 