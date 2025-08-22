const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");
const { logger } = require("../utils/logger");

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res, next) => {
    const {
        status,
        priority,
        categoryId,
        courseId,
        dueDate,
        search,
        page = 1,
        limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
        userId: req.user.id,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (courseId) where.courseId = courseId;
    if (dueDate) {
        const date = new Date(dueDate);
        where.dueDate = {
            gte: date,
            lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
        };
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true, color: true },
                },
                course: {
                    select: { id: true, code: true, name: true },
                },
                subtasks: {
                    select: { id: true, title: true, status: true },
                },
                _count: {
                    select: { subtasks: true, timeLogs: true },
                },
            },
            orderBy: [
                { priority: "desc" },
                { dueDate: "asc" },
                { createdAt: "desc" },
            ],
            skip: parseInt(skip),
            take: parseInt(limit),
        }),
        prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        success: true,
        data: {
            tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        },
    });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
        include: {
            category: {
                select: { id: true, name: true, color: true },
            },
            course: {
                select: { id: true, code: true, name: true },
            },
            subtasks: {
                orderBy: { order: "asc" },
            },
            timeLogs: {
                orderBy: { startTime: "desc" },
            },
            reminders: {
                orderBy: { scheduledAt: "asc" },
            },
        },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { task },
    });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        priority,
        dueDate,
        estimatedHours,
        categoryId,
        courseId,
        tags,
        isRecurring,
        recurrence,
    } = req.body;

    // Validate category and course ownership
    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: { id: categoryId, userId: req.user.id },
        });
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
    }

    if (courseId) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, userId: req.user.id },
        });
        if (!course) {
            return next(new AppError("Course not found", 404));
        }
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
            categoryId,
            courseId,
            tags: tags ? JSON.stringify(tags) : null,
            isRecurring: isRecurring || false,
            recurrence: recurrence ? JSON.stringify(recurrence) : null,
            userId: req.user.id,
        },
        include: {
            category: {
                select: { id: true, name: true, color: true },
            },
            course: {
                select: { id: true, code: true, name: true },
            },
        },
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: { task },
    });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const {
        title,
        description,
        priority,
        status,
        dueDate,
        estimatedHours,
        actualHours,
        categoryId,
        courseId,
        tags,
    } = req.body;

    // Validate category and course ownership
    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: { id: categoryId, userId: req.user.id },
        });
        if (!category) {
            return next(new AppError("Category not found", 404));
        }
    }

    if (courseId) {
        const course = await prisma.course.findFirst({
            where: { id: courseId, userId: req.user.id },
        });
        if (!course) {
            return next(new AppError("Course not found", 404));
        }
    }

    const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: {
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : null,
            estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
            actualHours: actualHours ? parseFloat(actualHours) : null,
            categoryId,
            courseId,
            tags: tags ? JSON.stringify(tags) : null,
            completedAt:
                status === "COMPLETED" && !task.completedAt
                    ? new Date()
                    : task.completedAt,
        },
        include: {
            category: {
                select: { id: true, name: true, color: true },
            },
            course: {
                select: { id: true, code: true, name: true },
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: { task: updatedTask },
    });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    await prisma.task.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});

// @desc    Complete task
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const completeTask = asyncHandler(async (req, res, next) => {
    const task = await prisma.task.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: {
            status: "COMPLETED",
            completedAt: new Date(),
        },
        include: {
            category: {
                select: { id: true, name: true, color: true },
            },
            course: {
                select: { id: true, code: true, name: true },
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Task completed successfully",
        data: { task: updatedTask },
    });
});

// @desc    Get task analytics
// @route   GET /api/tasks/analytics
// @access  Private
const getTaskAnalytics = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    const where = {
        userId: req.user.id,
    };

    if (startDate && endDate) {
        where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    const [
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        tasksByPriority,
        tasksByStatus,
    ] = await Promise.all([
        prisma.task.count({ where }),
        prisma.task.count({ where: { ...where, status: "COMPLETED" } }),
        prisma.task.count({ where: { ...where, status: "PENDING" } }),
        prisma.task.count({
            where: {
                ...where,
                dueDate: { lt: new Date() },
                status: { not: "COMPLETED" },
            },
        }),
        prisma.task.groupBy({
            by: ["priority"],
            where,
            _count: { priority: true },
        }),
        prisma.task.groupBy({
            by: ["status"],
            where,
            _count: { status: true },
        }),
    ]);

    const completionRate =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.status(200).json({
        success: true,
        data: {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            completionRate: Math.round(completionRate * 100) / 100,
            tasksByPriority,
            tasksByStatus,
        },
    });
});

// @desc    Get task timeline
// @route   GET /api/tasks/timeline
// @access  Private
const getTaskTimeline = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    const where = {
        userId: req.user.id,
    };

    if (startDate && endDate) {
        where.dueDate = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    const tasks = await prisma.task.findMany({
        where,
        select: {
            id: true,
            title: true,
            dueDate: true,
            priority: true,
            status: true,
            category: {
                select: { name: true, color: true },
            },
        },
        orderBy: { dueDate: "asc" },
    });

    res.status(200).json({
        success: true,
        data: { tasks },
    });
});

// Subtask operations
const addSubtask = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const taskId = req.params.id;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.id },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const subtask = await prisma.subtask.create({
        data: {
            title,
            description,
            taskId,
        },
    });

    res.status(201).json({
        success: true,
        message: "Subtask added successfully",
        data: { subtask },
    });
});

const updateSubtask = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const { taskId, subtaskId } = req.params;

    const subtask = await prisma.subtask.findFirst({
        where: {
            id: subtaskId,
            task: { id: taskId, userId: req.user.id },
        },
    });

    if (!subtask) {
        return next(new AppError("Subtask not found", 404));
    }

    const updatedSubtask = await prisma.subtask.update({
        where: { id: subtaskId },
        data: { title, description },
    });

    res.status(200).json({
        success: true,
        message: "Subtask updated successfully",
        data: { subtask: updatedSubtask },
    });
});

const deleteSubtask = asyncHandler(async (req, res, next) => {
    const { taskId, subtaskId } = req.params;

    const subtask = await prisma.subtask.findFirst({
        where: {
            id: subtaskId,
            task: { id: taskId, userId: req.user.id },
        },
    });

    if (!subtask) {
        return next(new AppError("Subtask not found", 404));
    }

    await prisma.subtask.delete({
        where: { id: subtaskId },
    });

    res.status(200).json({
        success: true,
        message: "Subtask deleted successfully",
    });
});

const completeSubtask = asyncHandler(async (req, res, next) => {
    const { taskId, subtaskId } = req.params;

    const subtask = await prisma.subtask.findFirst({
        where: {
            id: subtaskId,
            task: { id: taskId, userId: req.user.id },
        },
    });

    if (!subtask) {
        return next(new AppError("Subtask not found", 404));
    }

    const updatedSubtask = await prisma.subtask.update({
        where: { id: subtaskId },
        data: {
            status: "COMPLETED",
            completedAt: new Date(),
        },
    });

    res.status(200).json({
        success: true,
        message: "Subtask completed successfully",
        data: { subtask: updatedSubtask },
    });
});

// Time logging operations
const logTime = asyncHandler(async (req, res, next) => {
    const { startTime, endTime, description } = req.body;
    const taskId = req.params.id;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.id },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    let duration = null;
    if (startTime && endTime) {
        duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60); // in minutes
    }

    const timeLog = await prisma.timeLog.create({
        data: {
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            duration,
            description,
            taskId,
        },
    });

    res.status(201).json({
        success: true,
        message: "Time logged successfully",
        data: { timeLog },
    });
});

const getTimeLogs = asyncHandler(async (req, res, next) => {
    const taskId = req.params.id;

    const task = await prisma.task.findFirst({
        where: { id: taskId, userId: req.user.id },
    });

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const timeLogs = await prisma.timeLog.findMany({
        where: { taskId },
        orderBy: { startTime: "desc" },
    });

    res.status(200).json({
        success: true,
        data: { timeLogs },
    });
});

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTaskAnalytics,
    getTaskTimeline,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    completeSubtask,
    logTime,
    getTimeLogs,
};
