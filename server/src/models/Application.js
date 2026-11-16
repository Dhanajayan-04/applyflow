const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            default: "Full-time"
        },

        location: {
            type: String,
            trim: true
        },

        jobUrl: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Assessment",
                "Interview",
                "Offer",
                "Rejected",
                "Withdrawn"
            ],
            default: "Applied"
        },

        appliedDate: {
            type: Date,
            default: Date.now
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;