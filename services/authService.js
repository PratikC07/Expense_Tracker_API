import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';
import { StatusCodes } from 'http-status-codes';

class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = StatusCodes.CONFLICT;
        throw error;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await userRepository.create(userData);
      
      // Create token
      const token = this._generateToken(user);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Error in register service:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Check if user exists
      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      // Create token
      const token = this._generateToken(user);
      
      // Remove password from response
      const { password: pass, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService(); 