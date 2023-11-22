// Import necessary modules
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 900, // limit each IP to 900 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: "Too many requests" });
    },
});

module.exports = limiter;
