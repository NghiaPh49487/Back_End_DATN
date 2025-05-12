import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
            default: 'pending'
        },
        shipping_address: {
            type: String
        },
        payment_method: {
            type: String
        },
        total_price: {
            type: Number,
            required: true
        },
        // Thêm các trường mới cho việc hủy đơn hàng
        cancel_reason: {
            type: String,
            default: null
        },
        cancelled_at: {
            type: Date,
            default: null
        },
        cancelled_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual để lấy các sản phẩm trong đơn hàng
OrderSchema.virtual('items', {
    ref: 'OrderItem',
    localField: '_id',
    foreignField: 'order_id'
});

export default mongoose.model("Order", OrderSchema);