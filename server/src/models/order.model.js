const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },

    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    status: {
        type: String,
        enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: { type: String, default: 'razorpay' },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);