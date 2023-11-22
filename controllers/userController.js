// Import the necessary modules
const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const generateResponse = require("../utils/generateResponse");

// Define a function to get user profile
exports.getUserProfile = async (req, res, next) => {
    // Get the user ID from the request query string
    const userId = req.query.userId;

    try {
        // Get the user's information from the database
        const user = await User.findById(userId).select(
            "name email availability province district level goal"
        );

        // Check if the user exists
        if (!user) {
            // Throw a custom error
            throw new CustomError("User not found", 404);
        }

        // Use generateResponse to send a success response with the user's data
        generateResponse(res, 200, "User retrieved successfully.", user);
    } catch (error) {
        console.error("Error getting user data:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};

// Define a function to update user profile
exports.updateUserProfile = async (req, res, next) => {
    // Get the user ID from the request query string
    const userId = req.query.userId;
    // Get the updated data from the request body
    const { availability, province, district, level, goal } = req.body;
    const updatedData = { availability, province, district, level, goal };

    try {
        // Update the user's information in the database and get the updated document
        const user = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });

        // Check if the user exists
        if (!user) {
            // Throw a custom error
            throw new CustomError("User not found", 404);
        }

        // Use generateResponse to send a success response with a success message
        generateResponse(res, 200, "Successfully updated.", null);
    } catch (error) {
        console.error("Error updating user data:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};
