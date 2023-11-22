// Currently, the implementation and purpose of this file is under review
// I am gathering more information before further implementation and modifications
// If you have any suggestions or insights, kindly let me know

// // Import necessary modules
// const Bowser = require("bowser");
// const CustomError = require("../utils/customError");

// // Define a constant with the supported browsers and their minimum versions
// const supportedBrowsers = {
//   Chrome: ">=51",
//   "Microsoft Edge": ">=18",
//   Safari: ">=15",
//   Firefox: ">=60",
//   Opera: ">=39",
//   mobile: {
//     Chrome: ">=116",
//     Safari: ">=13",
//     "Samsung Internet for Android": ">=5",
//     "Android Browser": ">=116",
//     Firefox: ">=116",
//   },
// };

// // Define a middleware function to check if the user's browser is supported
// const checkBrowserSupport = (req, res, next) => {
//   // Extract the user agent from the request headers
//   const userAgent = req.headers["user-agent"];
//   // Parse the user agent string using Bowser
//   const browser = Bowser.getParser(userAgent);

//   // Check if the user's browser is in the list of supported browsers
//   if (browser.satisfies(supportedBrowsers)) {
//     // If the browser is supported, proceed to the next middleware or route handler
//     next();
//   } else {
//     // If the browser is not supported, prepare a message listing the supported browsers
//     const desktopBrowsers = Object.keys(supportedBrowsers)
//       .filter((key) => key !== "mobile")
//       .map((key) => `${key} (${supportedBrowsers[key]})`);
//     const mobileBrowsers = Object.keys(supportedBrowsers.mobile).map(
//       (key) => `${key} (${supportedBrowsers.mobile[key]})`
//     );
//     // Create strings with commas and "or" to make it more readable
//     const desktopString =
//       desktopBrowsers.length > 1
//         ? desktopBrowsers.slice(0, -1).join(", ") + " or " + desktopBrowsers.slice(-1)
//         : desktopBrowsers[0];
//     const mobileString =
//       mobileBrowsers.length > 1
//         ? mobileBrowsers.slice(0, -1).join(", ") + " or " + mobileBrowsers.slice(-1)
//         : mobileBrowsers[0];

//     // Throw a custom error with status code 403 (Forbidden) and a message informing the user about the supported browsers
//     throw new CustomError(
//       `Sorry, this website does not support your browser. Please use one of the following browsers: ${desktopString} or mobile browsers: ${mobileString}.`,
//       403
//     );
//   }
// };

// module.exports = checkBrowserSupport;
