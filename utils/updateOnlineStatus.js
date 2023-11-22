// Import necessary modules
const User = require("../models/userModel");

// Define a function to update the online status of a user
const updateOnlineStatus = async (userId, status) => {
    try {
        // Update the 'online' field of the user document in the database
        const user = await User.findByIdAndUpdate(userId, { online: status }, { new: true });
        console.log(`User's online status updated to ${status}:`, user.email);
    } catch (error) {
        console.error(`Error updating user's online status to ${status}:`, error);
    }
};

module.exports = updateOnlineStatus;
