import { User } from '../models/index.js';

class UserRepository {
  async findById(id) {
    return User.findById(id).lean();
  }

  async findByEmail(email) {
    return User.findOne({ email }).lean();
  }

  async create(userData) {
    const user = new User(userData);
    await user.save();
    return user.toObject();
  }

  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, { new: true }).lean();
  }

  async delete(id) {
    return User.findByIdAndDelete(id).lean();
  }
}

export default new UserRepository(); 