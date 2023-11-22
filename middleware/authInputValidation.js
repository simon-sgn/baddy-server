// Import necessary modules
const validator = require("validator");
const CustomError = require("../utils/customError");

// Define a middleware to validate sign up inputs
exports.validateSignUpInputs = (req, res, next) => {
    const { email, password, name } = req.body;

    // Validate email format
    if (!validator.isEmail(email) || email.length > 320) {
        throw new CustomError("Invalid email format.", 400);
    }

    // Validate password and password strength
    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }) ||
        password.length > 64
    ) {
        throw new CustomError(
            "Passwords must be between 8 and 64 characters long and include at least one lowercase and uppercase letter, one number, and one symbol.",
            400
        );
    }

    // Validate name length
    if (!validator.isLength(name, { min: 1, max: 150 })) {
        throw new CustomError("Display name must be a string between 1 and 150 characters.", 400);
    }

    next();
};

// Define a middleware to validate sign in inputs
exports.validateSignInInputs = (req, res, next) => {
    const { email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email) || email.length > 320) {
        throw new CustomError("Invalid email format.", 400);
    }

    // Validate password length
    if (!validator.isLength(password, { min: 8 }) || password.length > 64) {
        throw new CustomError(
            "Password must be within the range of 8 and 64 characters long.",
            400
        );
    }

    next();
};
