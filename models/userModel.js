// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a user
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    online: { type: Boolean, default: true },
    availability: { type: [String] },
    province: { type: [String] },
    district: { type: [String] },
    level: { type: String },
    goal: { type: [String] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
