// Import necessary modules
const Chat = require("../models/chatModel");

// Define a function to handle incoming messages
const handleMessage = async (io, data) => {
    const { sender, receiver, message } = data;
    try {
        // Check if message is a string and its length is not over 800 characters
        if (typeof message !== "string" || message.length > 800) {
            throw new Error("Invalid message");
        }

        // Create a new chat document in the database with the sender, receiver, and message
        const chat = await Chat.create({ sender, receiver, message });
        console.log("Message saved:", chat);

        // Emit the 'message' event to both the sender and receiver with the chat document
        io.to(receiver).emit("message", chat);
        io.to(sender).emit("message", chat);
    } catch (error) {
        console.error("Error saving message:", error);
    }
};

module.exports = handleMessage;
