import mongoose, { Schema, model } from "mongoose";

let orderSchema = new Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Canceled', 'Completed'],
        required: true,
        default: 'Pending',
    },
    orderType: {
        type: String,
        enum: ['Pickup', 'Delivery'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Order = model('Order', orderSchema, 'Order');
export default Order;