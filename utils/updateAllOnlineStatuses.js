// Import necessary modules
const User = require("../models/userModel");

// Define a function to periodically check the online status of all users and update it in the database
// This is helpful for cases where the server crashes or restarts, and the online status of users in the database might not reflect their actual status
const updateAllOnlineStatuses = async (io) => {
    // Fetch all the active sockets and store their user IDs in a set
    const sockets = await io.fetchSockets();
    const socketSet = new Set(sockets.map((socket) => socket.userId));

    // Retrieve only the _id and online properties for all users from the database
    const users = await User.find({}, { _id: 1, online: 1 });

    // Initialize an array to store bulk operations for updating users
    const bulkOps = [];

    for (let user of users) {
        const userIdString = user._id.toString();
        // Check if the user has a socket connection and is not marked online in the database
        if (socketSet.has(userIdString) && !user.online) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: user._id },
                    update: { online: true },
                },
            });
        }
        // Check if the user doesn't have a socket connection but is marked online in the database
        else if (!socketSet.has(userIdString) && user.online) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: user._id },
                    update: { online: false },
                },
            });
        }
    }

    // If there are operations in the bulkOps array, execute the bulk write operation
    if (bulkOps.length > 0) {
        await User.bulkWrite(bulkOps);
    }
};

module.exports = updateAllOnlineStatuses;
