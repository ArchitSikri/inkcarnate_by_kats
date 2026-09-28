const devOnly = (req, res, next) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(404).json({ message: 'Route not found' });
    }
    next();
};

module.exports = devOnly;