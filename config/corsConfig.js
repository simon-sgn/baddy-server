// Define allowed origins for CORS based on the Node environment
let allowedOrigins;
if (process.env.NODE_ENV === "production") {
    // In production, only allow requests from the production client
    allowedOrigins = [process.env.PROD_ORIGIN];
} else {
    // In development, use localhost
    allowedOrigins = [process.env.DEV_ORIGIN];
}

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

module.exports = corsOptions;
