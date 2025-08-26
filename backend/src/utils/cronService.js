const cron = require("node-cron");
const { prisma } = require("./database");
const { sendTaskReminders } = require("./emailService");
const { logger } = require("./logger");

// Function to get tasks due today for all users
const getTasksDueToday = async () => {
    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
    );

    try {
        const usersWithTasks = await prisma.user.findMany({
            where: {
                isActive: true,
                tasks: {
                    some: {
                        dueDate: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                        status: {
                            in: ["PENDING", "IN_PROGRESS"],
                        },
                    },
                },
            },
            include: {
                tasks: {
                    where: {
                        dueDate: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                        status: {
                            in: ["PENDING", "IN_PROGRESS"],
                        },
                    },
                    include: {
                        category: {
                            select: {
                                name: true,
                                color: true,
                            },
                        },
                        course: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
                },
            },
        });

        return usersWithTasks;
    } catch (error) {
        logger.error("Error fetching tasks due today:", error);
        throw error;
    }
};

// Function to send daily task reminders
const sendDailyTaskReminders = async () => {
    logger.info("Starting daily task reminder job...");

    try {
        const usersWithTasks = await getTasksDueToday();

        if (usersWithTasks.length === 0) {
            logger.info("No users have tasks due today");
            return;
        }

        logger.info(
            `Found ${usersWithTasks.length} users with tasks due today`
        );

        const results = [];

        for (const user of usersWithTasks) {
            try {
                logger.info(
                    `Processing reminders for user: ${user.email} (${user.tasks.length} tasks)`
                );

                const result = await sendTaskReminders(user, user.tasks);
                results.push({
                    userId: user.id,
                    email: user.email,
                    success: true,
                    tasksCount: user.tasks.length,
                    ...result,
                });

                // Create reminder records in database
                await prisma.reminder.createMany({
                    data: user.tasks.map((task) => ({
                        title: `Daily Task Reminder - ${task.title}`,
                        message: `Task "${task.title}" is due today`,
                        type: "EMAIL",
                        scheduledAt: new Date(),
                        isSent: true,
                        sentAt: new Date(),
                        userId: user.id,
                        taskId: task.id,
                    })),
                });

                logger.info(
                    `Successfully sent reminders to ${user.email} for ${user.tasks.length} tasks`
                );

                // Add a small delay between users to avoid overwhelming the email service
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                logger.error(
                    `Failed to send reminders to user ${user.email}:`,
                    error
                );
                results.push({
                    userId: user.id,
                    email: user.email,
                    success: false,
                    error: error.message,
                });
            }
        }

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;

        logger.info(
            `Daily task reminder job completed. Success: ${successCount}, Failures: ${failureCount}`
        );

        return results;
    } catch (error) {
        logger.error("Error in daily task reminder job:", error);
        throw error;
    }
};

// Initialize cron jobs
const initializeCronJobs = () => {
    // Schedule daily task reminders at 10:00 AM
    cron.schedule(
        "0 10 * * *",
        async () => {
            logger.info(
                "🕙 Daily task reminder cron job triggered at 10:00 AM"
            );
            try {
                await sendDailyTaskReminders();
            } catch (error) {
                logger.error("Error in daily task reminder cron job:", error);
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Dhaka", // Adjust timezone as needed
        }
    );

    logger.info("✅ Cron jobs initialized successfully");
    logger.info("📅 Daily task reminders scheduled for 10:00 AM daily");
};

// Manual trigger function for testing
const triggerDailyReminders = async () => {
    logger.info("🔄 Manually triggering daily task reminders...");
    try {
        const results = await sendDailyTaskReminders();
        logger.info("✅ Manual daily task reminders completed");
        return results;
    } catch (error) {
        logger.error("❌ Error in manual daily task reminders:", error);
        throw error;
    }
};

module.exports = {
    initializeCronJobs,
    sendDailyTaskReminders,
    triggerDailyReminders,
    getTasksDueToday,
};
