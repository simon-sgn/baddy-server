// Note: For deployment, deploy the API to a subdomain. This ensures that the Origin header is always present, providing better protection against CSRF
// Import necessary modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const setupSockets = require("./socket");
const connectDB = require("./db");
const CustomError = require("./utils/customError");
const router = require("./routes/index");
const corsOptions = require("./config/corsConfig");
const limiter = require("./config/rateLimitConfig");

// Connect to database
connectDB();

// Create an Express application
const app = express();

// Application-level middleware
// Set up CORS with the allowed origins and allow credentials
app.use(cors(corsOptions));

// Apply rate limiting to all requests
app.use(limiter);

// Parse incoming request bodies in a middleware before handlers, available under the req.body property
app.use(express.json());

// User the router under '/api'
app.use("/api", router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new CustomError("API endpoint does not exist", 404));
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Log the error details and the request that caused it
    console.error(
        `Error: ${message}\nStatus code: ${statusCode}\nRequest: ${req.method} ${req.path}`
    );
    res.status(statusCode).json({ error: message });
});

// Create a new http.Server instance with the app instance
const http = require("http");
const server = http.createServer(app);

// Call the function to set up socket.io
setupSockets(server);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    return console.log(`Express and Socket.io are listening on port ${port}`);
});
