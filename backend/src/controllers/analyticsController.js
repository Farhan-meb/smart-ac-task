const { prisma } = require("../utils/database");
const { asyncHandler } = require("../middleware/errorHandler");

const getDashboardStats = asyncHandler(async (req, res, next) => {
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
        totalCourses,
        totalCategories,
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
        prisma.course.count({ where: { userId: req.user.id } }),
        prisma.category.count({ where: { userId: req.user.id } }),
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
            totalCourses,
            totalCategories,
            completionRate: Math.round(completionRate * 100) / 100,
        },
    });
});

const getTaskProgress = asyncHandler(async (req, res, next) => {
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

    const tasksByStatus = await prisma.task.groupBy({
        by: ["status"],
        where,
        _count: { status: true },
    });

    const tasksByPriority = await prisma.task.groupBy({
        by: ["priority"],
        where,
        _count: { priority: true },
    });

    res.status(200).json({
        success: true,
        data: {
            tasksByStatus,
            tasksByPriority,
        },
    });
});

const getProductivityMetrics = asyncHandler(async (req, res, next) => {
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

    const tasks = await prisma.task.findMany({
        where,
        select: {
            estimatedHours: true,
            actualHours: true,
            status: true,
            completedAt: true,
        },
    });

    const totalEstimatedHours = tasks.reduce(
        (sum, task) => sum + (task.estimatedHours || 0),
        0
    );
    const totalActualHours = tasks.reduce(
        (sum, task) => sum + (task.actualHours || 0),
        0
    );
    const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const efficiency =
        totalEstimatedHours > 0
            ? (totalActualHours / totalEstimatedHours) * 100
            : 0;

    res.status(200).json({
        success: true,
        data: {
            totalEstimatedHours,
            totalActualHours,
            completedTasks,
            efficiency: Math.round(efficiency * 100) / 100,
        },
    });
});

const getTimeAnalysis = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    const where = {
        task: { userId: req.user.id },
    };

    if (startDate && endDate) {
        where.startTime = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    const timeLogs = await prisma.timeLog.findMany({
        where,
        include: {
            task: {
                select: { title: true, category: { select: { name: true } } },
            },
        },
        orderBy: { startTime: "desc" },
    });

    const totalTimeSpent = timeLogs.reduce(
        (sum, log) => sum + (log.duration || 0),
        0
    );

    res.status(200).json({
        success: true,
        data: {
            timeLogs,
            totalTimeSpent,
        },
    });
});

const getCategoryBreakdown = asyncHandler(async (req, res, next) => {
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

    const categories = await prisma.category.findMany({
        where,
        include: {
            tasks: {
                select: {
                    status: true,
                    priority: true,
                },
            },
        },
    });

    const categoryStats = categories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        totalTasks: category.tasks.length,
        completedTasks: category.tasks.filter(
            (task) => task.status === "COMPLETED"
        ).length,
        pendingTasks: category.tasks.filter((task) => task.status === "PENDING")
            .length,
    }));

    res.status(200).json({
        success: true,
        data: { categoryStats },
    });
});

const getCoursePerformance = asyncHandler(async (req, res, next) => {
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

    const courses = await prisma.course.findMany({
        where,
        include: {
            tasks: {
                select: {
                    status: true,
                    priority: true,
                    estimatedHours: true,
                    actualHours: true,
                },
            },
        },
    });

    const courseStats = courses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        totalTasks: course.tasks.length,
        completedTasks: course.tasks.filter(
            (task) => task.status === "COMPLETED"
        ).length,
        totalEstimatedHours: course.tasks.reduce(
            (sum, task) => sum + (task.estimatedHours || 0),
            0
        ),
        totalActualHours: course.tasks.reduce(
            (sum, task) => sum + (task.actualHours || 0),
            0
        ),
    }));

    res.status(200).json({
        success: true,
        data: { courseStats },
    });
});

const getWeeklyReport = asyncHandler(async (req, res, next) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const where = {
        userId: req.user.id,
        createdAt: {
            gte: startOfWeek,
            lte: endOfWeek,
        },
    };

    const [tasks, completedTasks, newTasks] = await Promise.all([
        prisma.task.findMany({ where }),
        prisma.task.count({ where: { ...where, status: "COMPLETED" } }),
        prisma.task.count({ where }),
    ]);

    res.status(200).json({
        success: true,
        data: {
            period: "week",
            startDate: startOfWeek,
            endDate: endOfWeek,
            totalTasks: tasks.length,
            completedTasks,
            newTasks,
            completionRate:
                tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
        },
    });
});

const getMonthlyReport = asyncHandler(async (req, res, next) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const where = {
        userId: req.user.id,
        createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
        },
    };

    const [tasks, completedTasks, newTasks] = await Promise.all([
        prisma.task.findMany({ where }),
        prisma.task.count({ where: { ...where, status: "COMPLETED" } }),
        prisma.task.count({ where }),
    ]);

    res.status(200).json({
        success: true,
        data: {
            period: "month",
            startDate: startOfMonth,
            endDate: endOfMonth,
            totalTasks: tasks.length,
            completedTasks,
            newTasks,
            completionRate:
                tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
        },
    });
});

module.exports = {
    getDashboardStats,
    getTaskProgress,
    getProductivityMetrics,
    getTimeAnalysis,
    getCategoryBreakdown,
    getCoursePerformance,
    getWeeklyReport,
    getMonthlyReport,
};
