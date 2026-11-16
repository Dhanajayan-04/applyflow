const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true
        },

        interviewDate: {
            type: Date,
            required: true
        },

        interviewType: {
            type: String,
            enum: [
                "Online",
                "Phone",
                "In-person",
                "Technical",
                "HR",
                "Managerial"
            ],
            required: true
        },

        meetingLink: {
            type: String,
            trim: true
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

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;