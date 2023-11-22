// Define a class for custom errors
class CustomError extends Error {
    // The constructor accepts two parameters: the error message and the HTTP status code
    constructor(message, statusCode) {
        // Call the parent class constructor with the error message
        super(message);
        // Set the HTTP status code
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;
