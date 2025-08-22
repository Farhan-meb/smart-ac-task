const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.use(protect);

const courseValidation = [
    body("code")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Course code must be between 1 and 20 characters"),
    body("name")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Course name must be between 1 and 100 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
    body("credits")
        .optional()
        .isInt({ min: 1, max: 30 })
        .withMessage("Credits must be between 1 and 30"),
    body("semester")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Semester must be less than 20 characters"),
    body("year")
        .optional()
        .isInt({ min: 2020, max: 2030 })
        .withMessage("Year must be between 2020 and 2030"),
    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid date"),
    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("End date must be a valid date"),
];

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", courseValidation, validateRequest, createCourse);
router.put("/:id", courseValidation, validateRequest, updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
