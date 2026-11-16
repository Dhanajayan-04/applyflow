const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/applicationRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to ApplyFlow API"
    });
});

module.exports = app;