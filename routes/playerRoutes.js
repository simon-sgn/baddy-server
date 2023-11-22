// Import the necessary modules
const express = require("express");
const playerController = require("../controllers/playerController");
const authenticateJWT = require("../middleware/authenticateJWT");
const checkRevokedToken = require("../middleware/checkRevokedToken");

// Create a new router
const router = express.Router();

// Define routes, use authentication middleware for all routes
router.get("/search-players", authenticateJWT, checkRevokedToken, playerController.searchPlayers);
router.get(
    "/get-player-profile",
    authenticateJWT,
    checkRevokedToken,
    playerController.getPlayerProfile
);

module.exports = router;
