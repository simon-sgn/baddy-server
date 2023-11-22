// Import necessary modules
const RevokedToken = require("../models/revokedTokenModel");
const CustomError = require("../utils/customError");

// Define a middleware to check if a token is revoked
const checkRevokedToken = async (req, res, next) => {
    // Get the token ID (jti claim)
    const tokenId = req.tokenId;

    try {
        // Check if the token ID is in the list of revoked tokens
        const revokedToken = await RevokedToken.findOne({ tokenId });

        // If the token is found in the list, it has been revoked
        if (revokedToken) {
            // Throw a custom error indicating that the token is invalid
            throw new CustomError("Invalid token", 401);
        }

        // If not revoked, call next() to continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error checking revoked token:", error);
        next(error);
    }
};

module.exports = checkRevokedToken;
