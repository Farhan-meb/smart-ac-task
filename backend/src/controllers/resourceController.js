const { prisma } = require("../utils/database");
const { AppError } = require("../middleware/errorHandler");
const { asyncHandler } = require("../middleware/errorHandler");

const getResources = asyncHandler(async (req, res, next) => {
    const resources = await prisma.resource.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        data: { resources },
    });
});

const getResource = asyncHandler(async (req, res, next) => {
    const resource = await prisma.resource.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!resource) {
        return next(new AppError("Resource not found", 404));
    }

    res.status(200).json({
        success: true,
        data: { resource },
    });
});

const createResource = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        type,
        url,
        filePath,
        fileSize,
        tags,
        isPublic,
    } = req.body;

    const resource = await prisma.resource.create({
        data: {
            title,
            description,
            type,
            url,
            filePath,
            fileSize: fileSize ? parseInt(fileSize) : null,
            tags: tags ? JSON.stringify(tags) : null,
            isPublic: isPublic || false,
            userId: req.user.id,
        },
    });

    res.status(201).json({
        success: true,
        message: "Resource created successfully",
        data: { resource },
    });
});

const updateResource = asyncHandler(async (req, res, next) => {
    const resource = await prisma.resource.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!resource) {
        return next(new AppError("Resource not found", 404));
    }

    const {
        title,
        description,
        type,
        url,
        filePath,
        fileSize,
        tags,
        isPublic,
    } = req.body;

    const updatedResource = await prisma.resource.update({
        where: { id: req.params.id },
        data: {
            title,
            description,
            type,
            url,
            filePath,
            fileSize: fileSize ? parseInt(fileSize) : null,
            tags: tags ? JSON.stringify(tags) : null,
            isPublic,
        },
    });

    res.status(200).json({
        success: true,
        message: "Resource updated successfully",
        data: { resource: updatedResource },
    });
});

const deleteResource = asyncHandler(async (req, res, next) => {
    const resource = await prisma.resource.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!resource) {
        return next(new AppError("Resource not found", 404));
    }

    await prisma.resource.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({
        success: true,
        message: "Resource deleted successfully",
    });
});

const uploadFile = asyncHandler(async (req, res, next) => {
    // This would handle file upload logic
    // For now, we'll return a placeholder response
    res.status(200).json({
        success: true,
        message: "File upload endpoint - implementation needed",
    });
});

module.exports = {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    uploadFile,
};
