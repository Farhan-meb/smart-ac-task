const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");
const {
    triggerDailyReminders: triggerReminders,
} = require("../utils/cronService");
const { logger } = require("../utils/logger");

const getReminders = asyncHandler(async (req, res, next) => {
    const reminders = await prisma.reminder.findMany({
        where: { userId: req.user.id },
        include: {
            task: {
                select: { id: true, title: true },
            },
        },
        orderBy: { scheduledAt: "asc" },
    });

    res.status(200).json({
        success: true,
        data: { reminders },
    });
});

const getReminder = asyncHandler(async (req, res, next) => {
    const reminder = await prisma.reminder.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
        include: {
            task: {
                select: { id: true, title: true },
            },
        },
    });

    if (!reminder) {
        return next(new AppError("Reminder not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { reminder },
    });
});

const createReminder = asyncHandler(async (req, res, next) => {
    const { title, message, type, scheduledAt, taskId } = req.body;

    if (taskId) {
        const task = await prisma.task.findFirst({
            where: { id: taskId, userId: req.user.id },
        });
        if (!task) {
            return next(new AppError("Task not found", 404));
        }
    }

    const reminder = await prisma.reminder.create({
        data: {
            title,
            message,
            type: type || "EMAIL",
            scheduledAt: new Date(scheduledAt),
            taskId,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        success: true,
        message: "Reminder created successfully",
        data: { reminder },
    });
});

const updateReminder = asyncHandler(async (req, res, next) => {
    const reminder = await prisma.reminder.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!reminder) {
        return next(new AppError("Reminder not found", 404));
    }

    const { title, message, type, scheduledAt, taskId } = req.body;

    const updatedReminder = await prisma.reminder.update({
        where: { id: req.params.id },
        data: {
            title,
            message,
            type,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
            taskId,
        },
    });

    res.status(200).json({
        success: true,
        message: "Reminder updated successfully",
        data: { reminder: updatedReminder },
    });
});

const deleteReminder = asyncHandler(async (req, res, next) => {
    const reminder = await prisma.reminder.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!reminder) {
        return next(new AppError("Reminder not found", 404));
    }

    await prisma.reminder.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "Reminder deleted successfully",
    });
});

const markAsSent = asyncHandler(async (req, res, next) => {
    const reminder = await prisma.reminder.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!reminder) {
        return next(new AppError("Reminder not found", 404));
    }

    const updatedReminder = await prisma.reminder.update({
        where: { id: req.params.id },
        data: {
            isSent: true,
            sentAt: new Date(),
        },
    });

    res.status(200).json({
        success: true,
        message: "Reminder marked as sent",
        data: { reminder: updatedReminder },
    });
});

const triggerDailyReminders = asyncHandler(async (req, res, next) => {
    // Check if user is admin (you might want to add admin role check)
    if (req.user.role !== "ADMIN") {
        return next(
            new AppError("Only admins can trigger daily reminders", 403)
        );
    }

    try {
        const results = await triggerReminders();

        res.status(200).json({
            success: true,
            message: "Daily task reminders triggered successfully",
            data: { results },
        });
    } catch (error) {
        logger.error("Error triggering daily reminders:", error);
        return next(new AppError("Failed to trigger daily reminders", 500));
    }
});

module.exports = {
    getReminders,
    getReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsSent,
    triggerDailyReminders,
};
