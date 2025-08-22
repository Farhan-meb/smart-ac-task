const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");

const getCourses = asyncHandler(async (req, res, next) => {
    const courses = await prisma.course.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        data: { courses },
    });
});

const getCourse = asyncHandler(async (req, res, next) => {
    const course = await prisma.course.findFirst({
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

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { course },
    });
});

const createCourse = asyncHandler(async (req, res, next) => {
    const {
        code,
        name,
        description,
        credits,
        semester,
        year,
        startDate,
        endDate,
    } = req.body;

    const course = await prisma.course.create({
        data: {
            code,
            name,
            description,
            credits: credits ? parseInt(credits) : null,
            semester,
            year: year ? parseInt(year) : null,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: { course },
    });
});

const updateCourse = asyncHandler(async (req, res, next) => {
    const course = await prisma.course.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    const {
        code,
        name,
        description,
        credits,
        semester,
        year,
        startDate,
        endDate,
    } = req.body;

    const updatedCourse = await prisma.course.update({
        where: { id: req.params.id },
        data: {
            code,
            name,
            description,
            credits: credits ? parseInt(credits) : null,
            semester,
            year: year ? parseInt(year) : null,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: { course: updatedCourse },
    });
});

const deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await prisma.course.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    await prisma.course.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
