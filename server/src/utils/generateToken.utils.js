const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token valid for 30 days.
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_jwt_secret', {
        expiresIn: '30d'
    });
};

/**
 * Helper to set HttpOnly 30-day Cookie and return JSON response.
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user._id);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days in ms
        httpOnly: true, // Prevents client-side JS / XSS access to cookie
        secure: isProduction, // HTTPS only in production
        sameSite: isProduction ? 'none' : 'lax' // Cross-domain support in prod
    };

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            message,
            token, // Returned so frontend can use in Authorization Bearer header
            user: userObj
        });
};

module.exports = {
    generateToken,
    sendTokenResponse
};