// Import the necessary modules
const express = require("express");
const chatController = require("../controllers/chatController");
const authenticateJWT = require("../middleware/authenticateJWT");
const checkRevokedToken = require("../middleware/checkRevokedToken");

// Create a new router
const router = express.Router();

// Define routes for getting players in chat, player profile, and chat history
// Use authentication middleware for all routes
router.get(
    "/get-players-in-chat",
    authenticateJWT,
    checkRevokedToken,
    chatController.getPlayersInChat
);
router.get("/get-chat-history", authenticateJWT, checkRevokedToken, chatController.getChatHistory);

module.exports = router;
