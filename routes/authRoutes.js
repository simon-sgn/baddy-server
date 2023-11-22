// Import the necessary modules
const express = require("express");
const authController = require("../controllers/authController");
const authenticateJWT = require("../middleware/authenticateJWT");
const authInputValidation = require("../middleware/authInputValidation");
const checkRevokedToken = require("../middleware/checkRevokedToken");

// Create a new router
const router = express.Router();

// Define routes for sign up, sign in, token sign in, and sign out
// Use validation middleware for sign up and sign in routes, and use authenticateJWT for sign out route
router.post("/sign-up", authInputValidation.validateSignUpInputs, authController.signUp);
router.post("/sign-in", authInputValidation.validateSignInInputs, authController.signIn);
router.post("/token-sign-in", authController.tokenSignIn);
router.post("/sign-out", authenticateJWT, checkRevokedToken, authController.signOut);

module.exports = router;
