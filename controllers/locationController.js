// Import the necessary modules
const Province = require("../models/provinceModel");
const District = require("../models/districtModel");
const CustomError = require("../utils/customError");
const generateResponse = require("../utils/generateResponse");

// Define a function to get all provinces
exports.getProvinces = async (req, res, next) => {
    try {
        // Get only the names of the provinces from the database and sort them
        const provinces = await Province.find({}, { name: 1 }).sort({ name: 1 });
        // Use generateResponse to send a success response with the provinces array
        generateResponse(
            res,
            200,
            "Provinces retrieved successfully.",
            provinces.map((province) => province.name)
        );
    } catch (error) {
        console.error("Error getting provinces:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};

// Define a function to get districts
exports.getDistricts = async (req, res, next) => {
    // Get the province names from the request query string as an array
    const provinceNames = req.query.provinceNames.split(",");

    try {
        // Get the districts from the database that match the province names and sort them by name
        const districts = await District.aggregate([
            {
                $lookup: {
                    from: "provinces",
                    localField: "province_code",
                    foreignField: "code",
                    as: "province",
                },
            },
            {
                $match: {
                    "province.name": {
                        $in: provinceNames,
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    provinceName: "$province.name",
                },
            },
            {
                $unwind: {
                    path: "$provinceName",
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);

        // Use generateResponse to send a success response with the districts array
        generateResponse(
            res,
            200,
            "Districts retrieved successfully.",
            districts.map((district) => {
                // Split the province name into words
                const words = district.provinceName.split(" ");

                // Get the first letter of each word
                const initials = words.map((word) => word[0]).join("");

                // Return the district name concatenated with the province initials
                return `${district.name} (${initials})`;
            })
        );
    } catch (error) {
        console.error("Error getting districts:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};
