const Application = require("../models/Application");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Application.aggregate([
            {
                $match: {
                    user: new (require("mongoose").Types.ObjectId)(userId)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = {
            Applied: 0,
            Assessment: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0,
            Withdrawn: 0
        };

        stats.forEach((item) => {
            statusCounts[item._id] = item.count;
        });

        const totalApplications = Object.values(statusCounts)
            .reduce((total, count) => total + count, 0);

        const inProgress =
            statusCounts.Applied +
            statusCounts.Assessment +
            statusCounts.Interview;

        res.status(200).json({
            totalApplications,
            inProgress,
            statusCounts
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};