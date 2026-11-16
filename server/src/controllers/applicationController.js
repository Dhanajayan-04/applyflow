const Application = require("../models/Application");

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    try {
        const {
            companyName,
            jobTitle,
            jobType,
            location,
            jobUrl,
            status,
            appliedDate,
            notes
        } = req.body;

        // Validate required fields
        if (!companyName?.trim() || !jobTitle?.trim()) {
            return res.status(400).json({
                message: "Company name and job title are required"
            });
        }

        const allowedJobTypes = [
            "Full-time",
            "Part-time",
            "Internship",
            "Contract"
        ];

        const allowedStatuses = [
            "Applied",
            "Assessment",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn"
        ];

        if (
            jobType !== undefined &&
            !allowedJobTypes.includes(jobType)
        ) {
            return res.status(400).json({
                message: "Invalid job type"
            });
        }

        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Create application
        const application = await Application.create({
            user: req.user.id,
            companyName,
            jobTitle,
            jobType,
            location,
            jobUrl,
            status,
            appliedDate,
            notes
        });

        res.status(201).json({
            message: "Application created successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        });
    }
};


// @desc    Get all applications of the logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
        });
    }
};


const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            application
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        res.status(500).json({
            message: "Internal Server error",
        });
    }
};


const updateApplication = async (req, res) => {
    try {
        const {
            companyName,
            jobTitle,
            jobType,
            location,
            jobUrl,
            status,
            appliedDate,
            notes
        } = req.body;

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }


        const allowedJobTypes = [
            "Full-time",
            "Part-time",
            "Internship",
            "Contract"
        ];

        const allowedStatuses = [
            "Applied",
            "Assessment",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn"
        ];

        // Validate company name and job title
        if ((companyName !== undefined &&
                (typeof companyName !== "string" || !companyName.trim())) ||
            (jobTitle !== undefined && 
                (typeof jobTitle !== "string" || !jobTitle.trim()))
        ) {
            return res.status(400).json({
                message: "Company name and job title must be non-empty strings"
            });
        }

        // Validate job type
        if (
            jobType !== undefined &&
            !allowedJobTypes.includes(jobType)
        ) {
            return res.status(400).json({
                message: "Invalid job type"
            });
        }

        // Validate application status
        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Update only the fields provided
        if (companyName !== undefined) application.companyName = companyName;
        if (jobTitle !== undefined) application.jobTitle = jobTitle;
        if (jobType !== undefined) application.jobType = jobType;
        if (location !== undefined) application.location = location;
        if (jobUrl !== undefined) application.jobUrl = jobUrl;
        if (status !== undefined) application.status = status;
        if (appliedDate !== undefined) application.appliedDate = appliedDate;
        if (notes !== undefined) application.notes = notes;

        const updatedApplication = await application.save();

        res.status(200).json({
            message: "Application updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid application ID or field value"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Internal Server error",
        });
    }
};


const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        res.status(500).json({
            message: "Internal Server error",
        });
    }
};


module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication   
};