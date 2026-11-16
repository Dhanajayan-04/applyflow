const Interview = require("../models/Interview");
const Application = require("../models/Application");

// @desc    Schedule a new interview
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res) => {
    try {
        const {
            application,
            interviewDate,
            interviewType,
            meetingLink,
            notes
        } = req.body;

        // Validate required fields
        if (!application || !interviewDate || !interviewType) {
            return res.status(400).json({
                message: "Application, interview date and interview type are required"
            });
        }

        // Check whether the application belongs to the logged-in user
        const existingApplication = await Application.findOne({
            _id: application,
            user: req.user.id
        });

        if (!existingApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Create interview
        const interview = await Interview.create({
            user: req.user.id,
            application,
            interviewDate,
            interviewType,
            meetingLink,
            notes
        });

        res.status(201).json({
            message: "Interview scheduled successfully",
            interview
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
            message: "Server error",
            error: error.message
        });
    }
};


const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.user.id
        })
            .populate("application", "companyName jobTitle status")
            .sort({ interviewDate: 1 });

        res.status(200).json({
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("application", "companyName jobTitle status");

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            interview
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const updateInterview = async (req, res) => {
    try {
        const {
            interviewDate,
            interviewType,
            meetingLink,
            notes
        } = req.body;

        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        // Update only the fields provided
        if (interviewDate !== undefined) {
            interview.interviewDate = interviewDate;
        }

        if (interviewType !== undefined) {
            interview.interviewType = interviewType;
        }

        if (meetingLink !== undefined) {
            interview.meetingLink = meetingLink;
        }

        if (notes !== undefined) {
            interview.notes = notes;
        }

        const updatedInterview = await interview.save();

        res.status(200).json({
            message: "Interview updated successfully",
            interview: updatedInterview
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid interview ID or field value"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            message: "Interview deleted successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
};