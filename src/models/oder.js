/**
 * Model đơn hàng
 * Quản lý thông tin đơn hàng và trạng thái
 */

import mongoose from "mongoose";

/**
 * Schema đơn hàng
 * @field {ObjectId} user_id - ID người đặt hàng
 * @field {ObjectId} cart_id - ID giỏ hàng được dùng để tạo đơn
 * @field {string} status - Trạng thái đơn hàng
 * @field {string} shipping_address - Địa chỉ giao hàng
 * @field {string} payment_method - Phương thức thanh toán
 * @field {number} total_price - Tổng giá trị đơn hàng
 * @field {string} cancel_reason - Lý do hủy đơn (nếu có)
 * @field {Date} cancelled_at - Thời điểm hủy đơn
 * @field {ObjectId} cancelled_by - ID người hủy đơn
 */
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
            enum: {
                values: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
                message: 'Trạng thái {VALUE} không hợp lệ'
            },
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

// Thêm các virtual fields với labels tiếng Việt
OrderSchema.virtual('trangThai').get(function() {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao hàng',
        'delivered': 'Đã giao hàng',
        'canceled': 'Đã hủy'
    };
    return statusMap[this.status] || this.status;
});

export default mongoose.model("Order", OrderSchema);