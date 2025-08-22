const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");

const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await prisma.category.findMany({
        where: { userId: req.user.id },
        orderBy: { name: "asc" },
    });

    res.status(200).json({
        success: true,
        data: { categories },
    });
});

const getCategory = asyncHandler(async (req, res, next) => {
    const category = await prisma.category.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
        include: {
            tasks: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    priority: true,
                    dueDate: true,
                },
                orderBy: { dueDate: "asc" },
            },
        },
    });

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { category },
    });
});

const createCategory = asyncHandler(async (req, res, next) => {
    const { name, color, description } = req.body;

    const category = await prisma.category.create({
        data: {
            name,
            color: color || "#3B82F6",
            description,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: { category },
    });
});

const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await prisma.category.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    const { name, color, description } = req.body;

    const updatedCategory = await prisma.category.update({
        where: { id: req.params.id },
        data: { name, color, description },
    });

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: { category: updatedCategory },
    });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await prisma.category.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    await prisma.category.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
