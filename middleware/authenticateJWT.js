// Import necessary modules
const jwt = require("jsonwebtoken");
const parseCookies = require("../utils/parseCookies");
const CustomError = require("../utils/customError");

// Get the JWT secret key
const secretKey = process.env.JWT_SECRET_KEY;

// Define a middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    // Extract token from cookies
    const cookies = parseCookies(req.headers.cookie);
    let token;
    if (process.env.NODE_ENV === "production") {
        token = cookies["__Secure-token"];
    } else {
        token = cookies["token"];
    }

    // If no token, throw an unauthorized error
    if (!token) {
        throw new CustomError("Unauthorized", 401);
    }

    // Verify token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            throw new CustomError("Invalid token", 401);
        }

        // Attach the userId, jti claim and the expiry time of the token to the request for later use if needed
        req.userId = user.userId;
        req.tokenId = user.jti;
        req.tokenExpiresAt = user.exp;
        next();
    });
};

module.exports = authenticateJWT;
