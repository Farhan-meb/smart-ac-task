const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
} = require("../controllers/authController");

const router = express.Router();

// Validation rules
const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("firstName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters"),
    body("studentId")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Student ID must be between 1 and 20 characters"),
    body("programme")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Programme must be between 2 and 100 characters"),
    body("university")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("University must be between 2 and 100 characters"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        )
        .withMessage(
            "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
];

const forgotPasswordValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
];

const resetPasswordValidation = [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
];

// Routes
router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put(
    "/change-password",
    protect,
    changePasswordValidation,
    validateRequest,
    changePassword
);
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validateRequest,
    forgotPassword
);
router.post(
    "/reset-password",
    resetPasswordValidation,
    validateRequest,
    resetPassword
);
router.post("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);

module.exports = router;
