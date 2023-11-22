// Import necessary modules
const chatAggregate = require("../utils/chatAggregate");
const updateOnlineStatus = require("../utils/updateOnlineStatus");

// Define a function to handle new connections
const handleNewConnection = async (io, socket, userId) => {
    try {
        // The socket joins a room with the same name as the user's ID
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);

        // Get a list of ID objects of the players that the user has chatted with
        const playerIdObjects = await chatAggregate(userId);

        // Emit the "online" event to all the players the user has chatted with
        playerIdObjects.forEach((idObject) => {
            io.to(idObject._id.toString()).emit("online", userId);
        });

        // Store the user's ID in the socket object for later use
        socket.userId = userId;

        // Update the user's online status to true in the database
        await updateOnlineStatus(userId, true);
    } catch (error) {
        // Log the error for debugging purposes
        console.error(`Error in handleNewConnection for user ${userId}:`, error);
    }
};

module.exports = handleNewConnection;
