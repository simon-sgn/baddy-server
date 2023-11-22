// Import the necessary modules
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Get the secret key from environment variables
const secretKey = process.env.JWT_SECRET_KEY;

// Define a function to generate a JWT token
const generateToken = (userId) => {
    // The payload of the token includes the user ID and a unique token ID
    const payload = { userId, jti: uuidv4() };
    // OWASP Cheat Sheet - Adding claims to JWT and verifying them can enhance security
    // Use iss, aud, exp and nbf for JWT to make the app more secure in real projects
    return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

module.exports = generateToken;
