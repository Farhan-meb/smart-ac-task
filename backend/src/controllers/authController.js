const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");
const { logger } = require("../utils/logger");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
    const {
        email,
        password,
        firstName,
        lastName,
        studentId,
        programme,
        university,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { studentId }],
        },
    });

    if (existingUser) {
        return next(
            new AppError(
                "User with this email or student ID already exists",
                400
            )
        );
    }

    // Hash password
    const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_ROUNDS) || 12
    );
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            studentId,
            programme,
            university,
        },
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
            createdAt: true,
        },
    });

    // Create default categories for the user
    const defaultCategories = [
        { name: "Assignments", color: "#EF4444", isDefault: true },
        { name: "Research", color: "#3B82F6", isDefault: true },
        { name: "Exams", color: "#F59E0B", isDefault: true },
        { name: "Presentations", color: "#10B981", isDefault: true },
        { name: "Reading", color: "#8B5CF6", isDefault: true },
    ];

    await Promise.all(
        defaultCategories.map((category) =>
            prisma.category.create({
                data: {
                    ...category,
                    userId: user.id,
                },
            })
        )
    );

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user,
            token,
            refreshToken,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
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
        return next(new AppError("Invalid credentials", 401));
    }

    if (!user.isActive) {
        return next(new AppError("Account is deactivated", 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError("Invalid credentials", 401));
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: userWithoutPassword,
            token,
            refreshToken,
        },
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
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
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(200).json({
        success: true,
        data: { user },
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, university } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
            firstName,
            lastName,
            university,
        },
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
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user: updatedUser },
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { password: true },
    });

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );
    if (!isCurrentPasswordValid) {
        return next(new AppError("Current password is incorrect", 400));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_ROUNDS) || 12
    );
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedNewPassword },
    });

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(200).json({
            success: true,
            message:
                "If an account with that email exists, a password reset link has been sent",
        });
    }

    res.status(200).json({
        success: true,
        message:
            "If an account with that email exists, a password reset link has been sent",
    });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
    const { token, password } = req.body;

    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
});

// @desc    Verify email
// @route   POST /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError("Refresh token is required", 400));
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

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

        if (!user || !user.isActive) {
            return next(new AppError("Invalid refresh token", 401));
        }

        const newToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        res.status(200).json({
            success: true,
            data: {
                user,
                token: newToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        return next(new AppError("Invalid refresh token", 401));
    }
});

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
};
