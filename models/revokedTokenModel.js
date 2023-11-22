// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a revoked token
const RevokedTokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true,
    },
    // The expiry date of the revoked token (used for automatic deletion)
    expiresAt: {
        type: Date,
        required: true,
        expires: 0, // This sets up the TTL index for automatic deletion after expiry
    },
});

module.exports = mongoose.model("RevokedToken", RevokedTokenSchema);
