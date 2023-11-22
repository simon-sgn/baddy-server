// Import the necessary modules
const express = require("express");

// Create a new router
const router = express.Router();

// Import routes
const authRoutes = require("./authRoutes");
const chatRoutes = require("./chatRoutes");
const playerRoutes = require("./playerRoutes");
const userRoutes = require("./userRoutes");
const locationRoutes = require("./locationRoutes");

// Attach the routes to the router
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/player", playerRoutes);
router.use("/user", userRoutes);
router.use("/location", locationRoutes);

module.exports = router;
