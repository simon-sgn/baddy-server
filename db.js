// Import necessary modules
const mongoose = require("mongoose");
require("dotenv").config();

// Define an async function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Try to connect to the MongoDB database using the connection string from the environment variables
        await mongoose.connect(process.env.MONGO_URI);
        // If the connection is successful, log a success message
        console.log("Connected to MongoDB");
    } catch (err) {
        // If an error occurs while connecting, log the error and exit the process with a failure code
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
