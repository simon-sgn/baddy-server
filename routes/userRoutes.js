// Import the necessary modules
const express = require("express");
const userController = require("../controllers/userController");
const authenticateJWT = require("../middleware/authenticateJWT");
const checkRevokedToken = require("../middleware/checkRevokedToken");

// Create a new router
const router = express.Router();

// Define routes, use authentication middleware for all routes
router.get("/get-user-profile", authenticateJWT, checkRevokedToken, userController.getUserProfile);
router.put(
    "/update-user-profile",
    authenticateJWT,
    checkRevokedToken,
    userController.updateUserProfile
);

module.exports = router;
