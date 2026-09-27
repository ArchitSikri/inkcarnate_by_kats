const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['buyer', 'admin'], required: true },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ buyer: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);