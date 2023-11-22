// Define a function to parse cookies from the "Cookie" header
const parseCookies = (cookieHeader) => {
    if (cookieHeader) {
        // Split the "Cookie" header into individual cookie strings
        const cookieStrings = cookieHeader.split("; ");

        // Initialize an object to store parsed cookies
        const parsedCookies = {};

        // Iterate through the cookie strings and parse into key-value pairs
        cookieStrings.forEach((cookieString) => {
            const [key, value] = cookieString.split("=");
            parsedCookies[key] = value;
        });

        // Return the object of parsed cookies
        return parsedCookies;
    }

    return {}; // Return an empty object if no cookies
};

module.exports = parseCookies;
