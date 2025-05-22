import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/index.js';
import { logger } from '../utils/logger.js';

const signup = async(req, res) => {
    try {
    const { name, email, password } = req.body;

    const result = await authService.register({ name, email, password });

    res.cookie('token', result.token, {
                httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict',
    });

    res.status(StatusCodes.CREATED).json({
                success: true,
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
    });
            
    } catch (error) {
    logger.error('Error in signup controller:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
                success: false,
      message: error.message || 'Error registering user',
    });
  }
};

const login = async(req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);

    res.cookie('token', result.token, {
            httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict',
    });

    res.status(StatusCodes.OK).json({
            success: true,
      message: 'User logged in successfully',
      user: result.user,
      token: result.token,
    });
            
    } catch (error) {
    logger.error('Error in login controller:', error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
            success: false,
      message: error.message || 'Error logging in',
    });
    }
};

const AuthController = {
    signup,
    login,
};

export default AuthController;