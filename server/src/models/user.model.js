const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    googleId: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    phone: { type: String },
    addresses: [addressSchema],
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
    if (!this.password) return false;
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);