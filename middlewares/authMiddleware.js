import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/index.js';
import { logger } from '../utils/logger.js';

const verifyToken = async (req, res, next) => {
    try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, return error
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Not authorized, no token' 
      });
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Set user ID in request
    req.userId = decoded.id;
        next();
    } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      message: 'Not authorized, token failed' 
    });
    }
};

const authMiddleware = {
  verifyToken
};

export default authMiddleware;