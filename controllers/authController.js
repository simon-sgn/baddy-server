// Import necessary modules
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const RevokedToken = require("../models/revokedTokenModel");
const CustomError = require("../utils/customError");
const generateToken = require("../utils/generateToken");
const generateResponse = require("../utils/generateResponse");

// create a new OAuth2Client instance with client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define a function to handle user sign up
exports.signUp = async (req, res, next) => {
    const { email: rawEmail, password, name: rawName } = req.body;
    const email = rawEmail.toLowerCase();
    const name = rawName.toLowerCase();

    try {
        // Check if the email already exists in the database
        const user = await User.findOne({ email });
        if (user) {
            // If user exists, throw a custom error
            // OWASP authentication cheatsheet - should implement and use "A link to activate your account has been emailed to the address provided."
            throw new CustomError("Email already in use.", 400);
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const savedUser = await User.create({
            email,
            name: name,
            password: hashedPassword,
        });

        // Create a new object with the necessary data of the user to send back
        const userData = {
            name: savedUser.name,
            email: savedUser.email,
            userId: savedUser._id,
        };

        // Generate the token and a response with the user data and token
        const token = generateToken(userData.userId);
        // OWASP authentication cheatsheet - should implement and use "A link to activate your account has been emailed to the address provided."
        generateResponse(res, 201, "User created successfully.", userData, token);
    } catch (error) {
        console.error("Error signing up:", error);
        // Pass the error to the error handling middleware
        next(error);
    }
};

// Define a function to handle sign in with Google token
exports.tokenSignIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the header exists and has the format "Bearer <token>"
    if (authHeader && authHeader.startsWith("Bearer ")) {
        // Extract the token from the header by removing the "Bearer " prefix
        const googleToken = authHeader.slice(7);
        try {
            // Verify and decode the JWT
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            // Check if the aud property matches the client ID
            if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
                // Invalid token, throw a custom error
                throw new CustomError("Sign-in failed.", 401);
            }
            const email = payload.email.toLowerCase();
            const name = payload.name.toLowerCase();

            // Check if the user already exists in the database
            let user = await User.findOne({ email });
            if (!user) {
                // If user doesn't exist, create a new record with a generated password
                const password = uuidv4();
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await User.create({
                    email,
                    name,
                    password: hashedPassword,
                });
            }

            // Create a new object with the necessary data of the user to send back
            const userData = {
                name: user.name,
                email: user.email,
                userId: user._id,
            };

            // Generate token and a response with the user data and token
            const token = generateToken(userData.userId);
            generateResponse(res, 200, "User signed in successfully.", userData, token);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            next(error);
        }
    } else {
        // The Authorization header is missing or invalid, throw a custom error
        throw new CustomError("Sign-in failed.", 401);
    }
};

// Define a function to handle regular sign in
exports.signIn = async (req, res, next) => {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    try {
        // Get the user by their email and check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("Invalid user ID or password.", 401);
        }

        // Compare input password with stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new CustomError("Invalid user ID or password.", 401);
        }

        // Create a new object with the necessary data of the user to send back
        const userData = {
            name: user.name,
            email: user.email,
            userId: user._id,
        };

        // Generate a JWT token and response
        const token = generateToken(userData.userId);
        generateResponse(res, 200, "User signed in successfully", userData, token);
    } catch (error) {
        console.error("Error signing in:", error);
        next(error);
    }
};

// Define a function to handle sign out
exports.signOut = async (req, res, next) => {
    // Get the token ID and expiry date
    const tokenId = req.tokenId;
    const expiresAt = new Date(req.tokenExpiresAt * 1000);

    try {
        // Add the token ID to the revoked tokens list
        await RevokedToken.create({ tokenId, expiresAt });

        // Use generateResponse to send a success response and clear the cookie
        generateResponse(res, 200, "User signed out successfully.", null, null);
    } catch (error) {
        console.error("Error revoking token:", error);
        next(error);
    }
};
