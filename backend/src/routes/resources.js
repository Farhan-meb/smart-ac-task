const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    uploadFile,
} = require("../controllers/resourceController");

const router = express.Router();

router.use(protect);

const resourceValidation = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Resource title must be between 1 and 100 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
    body("type")
        .isIn(["DOCUMENT", "LINK", "VIDEO", "IMAGE", "OTHER"])
        .withMessage("Type must be DOCUMENT, LINK, VIDEO, IMAGE, or OTHER"),
    body("url").optional().isURL().withMessage("URL must be a valid URL"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("isPublic")
        .optional()
        .isBoolean()
        .withMessage("isPublic must be a boolean"),
];

router.get("/", getResources);
router.get("/:id", getResource);
router.post("/", resourceValidation, validateRequest, createResource);
router.put("/:id", resourceValidation, validateRequest, updateResource);
router.delete("/:id", deleteResource);
router.post("/upload", uploadFile);

module.exports = router;
