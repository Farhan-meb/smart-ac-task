const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");

const getUsers = asyncHandler(async (req, res, next) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            studentId: true,
            programme: true,
            university: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
        },
    });

    res.status(200).json({
        success: true,
        data: { users },
    });
});

const getUser = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            studentId: true,
            programme: true,
            university: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
        },
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { user },
    });
});

const updateUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, university } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { firstName, lastName, university },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            studentId: true,
            programme: true,
            university: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
        },
    });

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: { user: updatedUser },
    });
});

const deleteUser = asyncHandler(async (req, res, next) => {
    await prisma.user.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};
