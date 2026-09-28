const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const {
    registerUser,
    loginUser,
    googleLoginUser,
    logoutUser,
    getMyProfile,
    updateMyProfile,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/userauth.controller');
const { protect } = require('../middlewares/authUser.middleware');

const router = express.Router();

const emailRule = body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false });

const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    emailRule,
    body('phone').trim().matches(/^\d{10}$/).withMessage('A valid 10-digit phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginRules = [
    emailRule,
    body('password').notEmpty().withMessage('Password is required')
];

// Public Auth Routes
router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.post('/google', body('idToken').notEmpty().withMessage('Google ID token is required'), validate, googleLoginUser);
router.post('/logout', logoutUser);

// Protected Profile & Address Routes
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

module.exports = router;
