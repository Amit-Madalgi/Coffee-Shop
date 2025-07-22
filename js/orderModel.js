const mongoose = require('mongoose');

// Defines the structure for a single item within an order
const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true }
});

// Defines the main order structure
const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
    // You could also add a user ID here if users are logged in
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Order', orderSchema);