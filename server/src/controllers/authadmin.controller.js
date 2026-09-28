const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

const sendAdminAuthResponse = (res, admin, statusCode = 200) => {
    const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie('admin_token', token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din
    });

    res.status(statusCode).json({
        token, // chahe to Authorization header mein use kar sakta hai
        admin: { id: admin._id, name: admin.name, email: admin.email }
    });
};

const serverError = (res, err) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
};

// POST /api/admin/auth/register   (SIRF development mein, devOnly middleware se)
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        const admin = await Admin.create({ name, email, password });
        sendAdminAuthResponse(res, admin, 201);
    } catch (err) {
        serverError(res, err);
    }
};

// POST /api/admin/auth/login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        sendAdminAuthResponse(res, admin);
    } catch (err) {
        serverError(res, err);
    }
};

// POST /api/admin/auth/logout
exports.logoutAdmin = (req, res) => {
    res.clearCookie('admin_token', cookieOptions);
    res.json({ message: 'Logged out successfully' });
};

// GET /api/admin/auth/me  (page khulte hi login check ke liye)
exports.getAdminProfile = async (req, res) => {
    res.json({
        admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email }
    });
};