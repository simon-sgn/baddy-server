// Import the necessary modules
const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const generateResponse = require("../utils/generateResponse");

// Define a function to search players
exports.searchPlayers = async (req, res, next) => {
    // Get the query parameters from the request query string
    const { availability, province, district, level, goal } = req.query;

    // Create an empty query object
    const query = {};

    // Use conditional logic to add filters to the query object based on the query parameters
    if (availability && availability.length > 0) {
        // Convert the availability string to an array by splitting it by comma
        const availabilityArray = availability.split(",");
        // Add an availability filter to the query object
        query.availability = { $in: availabilityArray };
    }
    if (province && province.length > 0) {
        // Convert the province string to an array by splitting it by comma
        const provinceArray = province.split(",");
        // Add a province filter to the query object
        query.province = { $in: provinceArray };
    }
    if (district && district.length > 0) {
        // Convert the district string to an array by splitting it by comma
        const districtArray = district.split(",");
        // Add a district filter to the query object
        query.district = { $in: districtArray };
    }
    if (level && level.length > 0) {
        // Convert the level string to an array by splitting it by comma
        const levelArray = level.split(",");
        // Add a level filter to the query object
        query.level = { $in: levelArray };
    }
    if (goal && goal.length > 0) {
        // Convert the goal string to an array by splitting it by comma
        const goalArray = goal.split(",");
        // Add a goal filter to the query object
        query.goal = { $in: goalArray };
    }

    // Add a condition to exclude the current user from the results, the userId has been assigned to req by the authenticateJWT middleware
    query._id = { $ne: req.userId };

    try {
        const users = await User.find(query).select(
            "name online availability province district level goal"
        );
        // Use generateResponse to send a success response with the users array
        generateResponse(res, 200, "Users retrieved successfully.", users);
    } catch (error) {
        console.error("Error searching users:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};

// Define a function to get player profile
exports.getPlayerProfile = async (req, res, next) => {
    // Get the player ID from the request query string
    const playerId = req.query.playerId;

    try {
        // Get the player's data from the database
        const player = await User.findById(playerId).select(
            "name online availability province district level goal"
        );

        // Check if the player exists
        if (!player) {
            // Throw a custom error
            throw new CustomError("Player not found", 404);
        }

        // Use generateResponse to send a success response with the player's data
        generateResponse(res, 200, "Player retrieved successfully.", player);
    } catch (error) {
        console.error("Error getting player data:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};
