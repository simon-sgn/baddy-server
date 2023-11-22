// Import the mongoose module
const mongoose = require("mongoose");

// Define the schema for a district
const districtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    provinceCode: { type: String, required: true },
});

// Create a model from the schema
const District = mongoose.model("District", districtSchema);

module.exports = District;
