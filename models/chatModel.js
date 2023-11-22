// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a chat
const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create a model from the schema
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
