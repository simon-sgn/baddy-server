// Import necessary modules
const chatAggregate = require("../utils/chatAggregate");
const updateOnlineStatus = require("../utils/updateOnlineStatus");

// Define a function to handle disconnections
const handleDisconnection = async (io, socket) => {
    console.log("A user disconnected");
    let userId;
    try {
        // Get the user's ID from the socket object
        userId = socket.userId;

        // If userId is not defined (which can happen if the token was invalid), simply return
        if (!userId) {
            return;
        }

        // Get a list of ID objects of the players that the user has chatted with
        const playerIdObjects = await chatAggregate(userId);

        // Emit the "offline" event to all the players the user has chatted with
        playerIdObjects.forEach((idObject) => {
            io.to(idObject._id.toString()).emit("offline", userId);
        });

        // Update the user's online status to false in the database
        await updateOnlineStatus(userId, false);
    } catch (error) {
        // Log the error for debugging purposes
        console.error(`Error in handleDisconnection for user ${userId}:`, error);
    }
};

module.exports = handleDisconnection;
