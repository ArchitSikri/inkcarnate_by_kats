const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

exports.protectAdmin = async (req, res, next) => {
    let token = req.cookies?.admin_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, please login' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({ message: 'Admin no longer exists' });
        }
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired, please login again' });
    }
};