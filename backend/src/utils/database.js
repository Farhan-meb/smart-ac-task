const { PrismaClient } = require("@prisma/client");
const { logger } = require("./logger");

// Create a single PrismaClient instance that can be shared throughout your app
const prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});

// Log queries in development
if (process.env.NODE_ENV === "development") {
    prisma.$on("query", (e) => {
        logger.debug("Query: " + e.query);
        logger.debug("Params: " + e.params);
        logger.debug("Duration: " + e.duration + "ms");
    });
}

// Log errors
prisma.$on("error", (e) => {
    logger.error("Prisma Error: " + e.message);
});

// Log info
prisma.$on("info", (e) => {
    logger.info("Prisma Info: " + e.message);
});

// Log warnings
prisma.$on("warn", (e) => {
    logger.warn("Prisma Warning: " + e.message);
});

// Graceful shutdown
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

// Test database connection
async function testConnection() {
    try {
        await prisma.$connect();
        logger.info("✅ Database connection established successfully");
        return true;
    } catch (error) {
        logger.error("❌ Database connection failed:", error);
        return false;
    }
}

// Initialize database with default data
async function initializeDatabase() {
    try {
        // Check if any users exist
        const userCount = await prisma.user.count();

        if (userCount === 0) {
            logger.info("Initializing database with default data...");

            // Create default categories
            const defaultCategories = [
                { name: "Assignments", color: "#EF4444", isDefault: true },
                { name: "Research", color: "#3B82F6", isDefault: true },
                { name: "Exams", color: "#F59E0B", isDefault: true },
                { name: "Presentations", color: "#10B981", isDefault: true },
                { name: "Reading", color: "#8B5CF6", isDefault: true },
            ];

            // Note: Categories will be created when the first user registers
            logger.info("✅ Database initialization completed");
        } else {
            logger.info(
                "Database already contains data, skipping initialization"
            );
        }
    } catch (error) {
        logger.error("❌ Database initialization failed:", error);
        throw error;
    }
}

module.exports = {
    prisma,
    testConnection,
    initializeDatabase,
};
