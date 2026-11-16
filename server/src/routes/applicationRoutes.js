const express = require("express");
const router = express.Router();

const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

// Protected application routes
router.post("/", protect, createApplication);
router.get("/", protect, getApplications);

// Get a single application
router.get("/:id", protect, getApplicationById);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;