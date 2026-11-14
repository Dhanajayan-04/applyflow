const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Check whether token exists
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to request
        req.user = decoded;

        // Continue to next middleware or controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token invalid or expired"
        });
    }
};

module.exports = protect;