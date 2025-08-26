const express = require("express");
const { body, query } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
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
} = require("../controllers/taskController");

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation rules
const createTaskValidation = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Task title must be between 1 and 200 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .withMessage("Priority must be LOW, MEDIUM, HIGH, or URGENT"),
    body("status")
        .optional()
        .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
        .withMessage("Status must be PENDING, IN_PROGRESS, or COMPLETED"),
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date"),
    body("estimatedHours")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Estimated hours must be a positive number"),
    body("categoryId")
        .optional()
        .isString()
        .withMessage("Category ID must be a string"),
    body("courseId")
        .optional()
        .isString()
        .withMessage("Course ID must be a string"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("isRecurring")
        .optional()
        .isBoolean()
        .withMessage("isRecurring must be a boolean"),
];

const updateTaskValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Task title must be between 1 and 200 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .withMessage("Priority must be LOW, MEDIUM, HIGH, or URGENT"),
    body("status")
        .optional()
        .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
        .withMessage(
            "Status must be PENDING, IN_PROGRESS, COMPLETED, or CANCELLED"
        ),
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date"),
    body("estimatedHours")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Estimated hours must be a positive number"),
    body("actualHours")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Actual hours must be a positive number"),
];

const subtaskValidation = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Subtask title must be between 1 and 200 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
];

const timeLogValidation = [
    body("startTime")
        .isISO8601()
        .withMessage("Start time must be a valid date"),
    body("endTime")
        .optional()
        .isISO8601()
        .withMessage("End time must be a valid date"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
];

// Routes
router.get(
    "/",
    [
        query("status")
            .optional()
            .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
        query("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        query("categoryId").optional().isString(),
        query("courseId").optional().isString(),
        query("dueDate").optional().isISO8601(),
        query("search").optional().isString(),
        query("page").optional().isInt({ min: 1 }),
        query("limit").optional().isInt({ min: 1, max: 100 }),
    ],
    validateRequest,
    getTasks
);

router.get("/analytics", getTaskAnalytics);
router.get("/timeline", getTaskTimeline);

router.get("/:id", getTask);

router.post("/", createTaskValidation, validateRequest, createTask);

router.put("/:id", updateTaskValidation, validateRequest, updateTask);

router.delete("/:id", deleteTask);

router.patch("/:id/complete", completeTask);

// Subtask routes
router.post("/:id/subtasks", subtaskValidation, validateRequest, addSubtask);
router.put(
    "/:taskId/subtasks/:subtaskId",
    subtaskValidation,
    validateRequest,
    updateSubtask
);
router.delete("/:taskId/subtasks/:subtaskId", deleteSubtask);
router.patch("/:taskId/subtasks/:subtaskId/complete", completeSubtask);

// Time logging routes
router.post("/:id/time-logs", timeLogValidation, validateRequest, logTime);
router.get("/:id/time-logs", getTimeLogs);

module.exports = router;
