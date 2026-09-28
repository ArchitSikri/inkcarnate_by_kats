const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const devOnly = require('../utils/devonly.utils');
const { protectAdmin } = require('../middlewares/authAdmin.middleware');
const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile
} = require('../controllers/authadmin.controller');

const emailRule = body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false });

const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    emailRule,
    body('password').isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters')
];

const loginRules = [
    emailRule,
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', devOnly, registerRules, validate, registerAdmin);


router.post('/login', loginRules, validate, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protectAdmin, getAdminProfile);

module.exports = router;