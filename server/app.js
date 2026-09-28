const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDb = require("./src/config/database.config");

// Import Routes
const authUserRoutes = require("./src/routes/authuser.route");
const authAdminRoutes = require("./src/routes/authadmin.route");

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration for cookies & headers
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Allow during dev or specify strict array in prod
        }
    },
    credentials: true
}));

// Connect to Database
connectToDb();

// Base Route
app.get("/", (req, res) => {
    res.send("Inkcarnate API Server is Running!");
});

// API Routes
app.use("/api/v1/auth/user", authUserRoutes);
app.use("/api/v1/auth/admin", authAdminRoutes);

module.exports = app;