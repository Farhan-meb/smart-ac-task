const { logger } = require("../utils/logger");

// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    logger.error("Error occurred:", {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value: ${field}. Please use another value.`;
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again.";
        error = new AppError(message, 401);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Token expired. Please log in again.";
        error = new AppError(message, 401);
    }

    // Prisma errors
    if (err.code === "P2002") {
        const message = "A record with this unique field already exists.";
        error = new AppError(message, 400);
    }

    if (err.code === "P2025") {
        const message = "Record not found.";
        error = new AppError(message, 404);
    }

    if (err.code === "P2003") {
        const message = "Foreign key constraint failed.";
        error = new AppError(message, 400);
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
        ...(process.env.NODE_ENV === "development" && {
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
        }),
    });
};

// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    asyncHandler,
};
