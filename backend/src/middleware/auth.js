const jwt = require("jsonwebtoken");
const { prisma } = require("../utils/database");
const { AppError } = require("./errorHandler");
const { asyncHandler } = require("./errorHandler");

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
        return next(new AppError("Not authorized to access this route", 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                studentId: true,
                programme: true,
                university: true,
                avatar: true,
                role: true,
                isActive: true,
                isVerified: true,
            },
        });

        if (!user) {
            return next(new AppError("User not found", 401));
        }

        if (!user.isActive) {
            return next(new AppError("User account is deactivated", 401));
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError("Not authorized to access this route", 401));
    }
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    studentId: true,
                    programme: true,
                    university: true,
                    avatar: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                },
            });

            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Token is invalid, but we don't fail the request
            console.log("Invalid token in optional auth:", error.message);
        }
    }

    next();
});

module.exports = {
    protect,
    authorize,
    optionalAuth,
};
