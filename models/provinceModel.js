// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a province
const provinceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
});

// Create a model from the schema
const Province = mongoose.model("Province", provinceSchema);

module.exports = Province;
