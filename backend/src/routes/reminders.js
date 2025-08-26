const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    getReminders,
    getReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsSent,
    triggerDailyReminders,
} = require("../controllers/reminderController");

const router = express.Router();

router.use(protect);

const reminderValidation = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Reminder title must be between 1 and 100 characters"),
    body("message")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Message must be less than 500 characters"),
    body("type")
        .optional()
        .isIn(["EMAIL", "PUSH", "SMS"])
        .withMessage("Type must be EMAIL, PUSH, or SMS"),
    body("scheduledAt")
        .isISO8601()
        .withMessage("Scheduled time must be a valid date"),
    body("taskId")
        .optional()
        .isString()
        .withMessage("Task ID must be a string"),
];

router.get("/", getReminders);
router.get("/:id", getReminder);
router.post("/", reminderValidation, validateRequest, createReminder);
router.put("/:id", reminderValidation, validateRequest, updateReminder);
router.delete("/:id", deleteReminder);
router.patch("/:id/sent", markAsSent);
router.post("/trigger-daily", triggerDailyReminders);

module.exports = router;
