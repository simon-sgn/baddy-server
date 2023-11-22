// Import the necessary modules
const express = require("express");
const locationController = require("../controllers/locationController");
const authenticateJWT = require("../middleware/authenticateJWT");
const checkRevokedToken = require("../middleware/checkRevokedToken");

// Create a new router
const router = express.Router();

// Define routes for getting provinces and districts, use authentication middleware for all routes
router.get("/get-provinces", authenticateJWT, checkRevokedToken, locationController.getProvinces);
router.get("/get-districts", authenticateJWT, checkRevokedToken, locationController.getDistricts);

module.exports = router;
