// Define the maximum age for the token cookie (1 day in milliseconds)
const maxAge = 24 * 60 * 60 * 1000;

// Define a function to generate a response
const generateResponse = (res, statusCode, message, data, token) => {
    // If the token is provided, set the cookie
    if (token) {
        // Check if the application is running in production mode
        if (process.env.NODE_ENV === "production") {
            res.cookie("__Secure-token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: maxAge,
            });
        } else {
            // In non-production mode, set non-secure cookie options
            res.cookie("token", token, { maxAge: maxAge });
        }
    }

    // If the user is signing out, clear the cookie
    if (statusCode === 200 && message === "User signed out successfully.") {
        res.clearCookie("token");
    }

    // Send a JSON response with the status code, message, and data
    res.status(statusCode).json({ message, data });
};

module.exports = generateResponse;
