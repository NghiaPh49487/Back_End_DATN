/**
 * Model chi tiết đơn hàng
 * Lưu trữ thông tin các sản phẩm trong mỗi đơn hàng
 */

import mongoose from "mongoose";

/**
 * Schema chi tiết đơn hàng
 * @field {ObjectId} order_id - ID đơn hàng
 * @field {ObjectId} product_id - ID sản phẩm
 * @field {ObjectId} variant_id - ID biến thể sản phẩm
 * @field {number} quantity - Số lượng đặt mua
 * @field {number} price - Giá tại thời điểm đặt hàng
 */
const oderItemSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("OrderItem", oderItemSchema);