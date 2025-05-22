import { Category } from '../models/index.js';

class CategoryRepository {
  async findById(id) {
    return Category.findById(id).lean();
  }
  
  async findAll(filters = {}) {
    return Category.find(filters).sort({ name: 1 }).lean();
  }
  
  async findByNameAndUser(name, userId) {
    return Category.findOne({ 
      name, 
      $or: [{ user: userId }, { user: null }] 
    }).lean();
  }

  async findOne(filters = {}) {
    return Category.findOne(filters).lean();
  }
  
  async create(categoryData) {
    const category = new Category(categoryData);
    await category.save();
    return category.toObject();
  }
  
  async update(id, categoryData) {
    return Category.findByIdAndUpdate(id, categoryData, { new: true }).lean();
  }
  
  async delete(id) {
    return Category.findByIdAndDelete(id).lean();
  }
  
  async findOrCreate(name, type, userId) {
    let category = await this.findByNameAndUser(name, userId);
    
    if (!category) {
      category = await this.create({
        name,
        type,
        user: userId,
      });
    }
    
    return category;
  }
}

export default new CategoryRepository(); 