import { categoryRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';
import { StatusCodes } from 'http-status-codes';

class CategoryService {
  async getCategories(userId, type) {
    try {
      // Get both default categories (user: null) and user-specific categories
      const filters = {
        $or: [{ user: userId }, { user: null }],
      };
      
      if (type) {
        filters.type = type;
      }
      
      return categoryRepository.findAll(filters);
    } catch (error) {
      logger.error('Error in getCategories service:', error);
      throw error;
    }
  }
  
  async getCategoryById(id, userId) {
    try {
      const category = await categoryRepository.findById(id);
      
      if (!category) {
        const error = new Error('Category not found');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }
      
      // Allow access to default categories (user: null) or user's own categories
      if (category.user && category.user.toString() !== userId.toString()) {
        const error = new Error('Not authorized');
        error.statusCode = StatusCodes.FORBIDDEN;
        throw error;
      }
      
      return category;
    } catch (error) {
      logger.error('Error in getCategoryById service:', error);
      throw error;
    }
  }
  
  async createCategory(categoryData, userId) {
    try {
      const { name, type } = categoryData;
      
      // Check if category already exists for this user
      const existingCategory = await categoryRepository.findByNameAndUser(name, userId);
      
      if (existingCategory) {
        const error = new Error('Category already exists');
        error.statusCode = StatusCodes.CONFLICT;
        throw error;
      }
      
      // Create category
      const category = await categoryRepository.create({
        name,
        type,
        user: userId,
      });
      
      return category;
    } catch (error) {
      logger.error('Error in createCategory service:', error);
      throw error;
    }
  }
  
  async updateCategory(id, categoryData, userId) {
    try {
      // Check if category exists and belongs to user
      const existingCategory = await this.getCategoryById(id, userId);
      
      // Don't allow modifying default categories
      if (!existingCategory.user) {
        const error = new Error('Cannot modify default categories');
        error.statusCode = StatusCodes.FORBIDDEN;
        throw error;
      }

    //   if (categoryData.name && categoryData.name !== existingCategory.name) {
    //     const nameConflict = await categoryRepository.findOne({
    //         name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') },
    //         $or: [
    //             { user: userId },
    //             { user: null }
    //         ],
    //         _id: { $ne: id }
    //     });

    //     if (nameConflict) {
    //         const error = new Error('Category name already exists');
    //         error.statusCode = StatusCodes.CONFLICT;
    //         throw error;
    //     }
    // }
      
      // Update category
      const updatedCategory = await categoryRepository.update(id, categoryData);
      
      return updatedCategory;
    } catch (error) {
      logger.error('Error in updateCategory service:', error);
      throw error;
    }
  }
  
  async deleteCategory(id, userId) {
    try {
      // Check if category exists and belongs to user
      const existingCategory = await this.getCategoryById(id, userId);
      
      // Don't allow deleting default categories
      if (!existingCategory.user) {
        const error = new Error('Cannot delete default categories');
        error.statusCode = StatusCodes.FORBIDDEN;
        throw error;
      }
      
      // Delete category
      const deletedCategory = await categoryRepository.delete(id);
      
      return deletedCategory;
    } catch (error) {
      logger.error('Error in deleteCategory service:', error);
      throw error;
    }
  }
}

export default new CategoryService(); 