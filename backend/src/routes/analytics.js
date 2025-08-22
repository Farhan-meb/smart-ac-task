const express = require("express");
const { query } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    getDashboardStats,
    getTaskProgress,
    getProductivityMetrics,
    getTimeAnalysis,
    getCategoryBreakdown,
    getCoursePerformance,
    getWeeklyReport,
    getMonthlyReport,
} = require("../controllers/analyticsController");

const router = express.Router();

router.use(protect);

const dateRangeValidation = [
    query("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid date"),
    query("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date must be a valid date"),
    query("period")
        .optional()
        .isIn(["week", "month", "quarter", "year"])
        .withMessage("Period must be week, month, quarter, or year"),
];

router.get(
    "/dashboard",
    dateRangeValidation,
    validateRequest,
    getDashboardStats
);
router.get(
    "/task-progress",
    dateRangeValidation,
    validateRequest,
    getTaskProgress
);
router.get(
    "/productivity",
    dateRangeValidation,
    validateRequest,
    getProductivityMetrics
);
router.get(
    "/time-analysis",
    dateRangeValidation,
    validateRequest,
    getTimeAnalysis
);
router.get(
    "/category-breakdown",
    dateRangeValidation,
    validateRequest,
    getCategoryBreakdown
);
router.get(
    "/course-performance",
    dateRangeValidation,
    validateRequest,
    getCoursePerformance
);
router.get("/weekly-report", getWeeklyReport);
router.get("/monthly-report", getMonthlyReport);

module.exports = router;
