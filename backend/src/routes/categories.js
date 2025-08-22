const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.use(protect);

const categoryValidation = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Category name must be between 1 and 50 characters"),
    body("color")
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage("Color must be a valid hex color code"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Description must be less than 200 characters"),
];

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", categoryValidation, validateRequest, createCategory);
router.put("/:id", categoryValidation, validateRequest, updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
