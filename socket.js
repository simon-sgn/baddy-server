// Import necessary modules
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const parseCookies = require("./utils/parseCookies");
const timers = require("timers");
const corsOptions = require("./config/corsConfig");

// Get the secret key from environment variables
const secretKey = process.env.JWT_SECRET_KEY;

// Import utility function to update online statuses of all users
const updateAllOnlineStatuses = require("./utils/updateAllOnlineStatuses");

// Import socket event handlers
const handleNewConnection = require("./socketHandlers/handleNewConnection");
const handleMessage = require("./socketHandlers/handleMessage");
const handleDisconnection = require("./socketHandlers/handleDisconnection");

// Export a function that takes an HTTP server and sets up Socket.IO on it
module.exports = (server) => {
    // Initialize a new Socket.IO instance with the server and CORS settings
    const io = new Server(server, {
        cors: corsOptions,
    });

    // Listen for the 'connection' event, which is emitted when a client connects
    io.on("connection", (socket) => {
        console.log("A user connected");

        // Get the cookie from the request headers of the socket handshake
        const cookie = socket.request.headers.cookie;
        // Parse the cookie to get the JWT token
        const cookies = parseCookies(cookie);
        let token;
        if (process.env.NODE_ENV === "production") {
            token = cookies["__Secure-token"];
        } else {
            token = cookies["token"];
        }

        // Verify the token and handle accordingly
        jwt.verify(token, secretKey, async (error, payload) => {
            if (error) {
                // If the token is invalid, emit an 'auth_error' event to the client and disconnect after a delay
                console.error("Invalid token error:", error);
                socket.emit("auth_error", { message: "Invalid token" });
                setTimeout(() => socket.disconnect(), 300);
            } else {
                // If the token is valid, handle the new connection
                console.log("Valid token with userId:", payload.userId);
                handleNewConnection(io, socket, payload.userId);
            }
        });

        // Listen for 'message' events from clients and handle them
        socket.on("message", (data) => handleMessage(io, data));

        // Listen for 'disconnect' events from clients and handle them
        socket.on("disconnect", () => {
            handleDisconnection(io, socket);
        });
    });

    // Set up a timer to update all online statuses every 10 minutes (600000 milliseconds)
    timers.setInterval(() => updateAllOnlineStatuses(io), 600000);
};
