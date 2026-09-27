const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: [{
        url: { type: String, required: true },
        fileId: { type: String } // ImageKit se, delete/update ke liye
    }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    isOutOfStockManually: { type: Boolean, default: false },
    category: {
        type: String,
        enum: ['journal', 'day-planner', 'notebook', 'stationary', 'other'],
        required: true
    },
    tags: [{ type: String }],
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

productSchema.virtual('isAvailable').get(function () {
    return !this.isOutOfStockManually && this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);