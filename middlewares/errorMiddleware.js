// Error handling middleware for consistent error responses

/**
 * Not Found Error Handler - handles 404 errors when routes don't exist
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * General Error Handler - converts various error types to standardized API responses
 */
const errorHandler = (err, req, res, next) => {
    // Set status code (use existing code or default to 500)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }
    
    // Mongoose cast error (like invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID Format',
            error: `Invalid ${err.path}: ${err.value}`
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: 'Duplicate Error',
            error: `${field} already exists with value: ${err.keyValue[field]}`
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: err.message
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            error: err.message
        });
    }
    
    // Default error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.stack
    });
};

export { notFound, errorHandler }; 