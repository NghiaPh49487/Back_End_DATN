/**
 * Model chi tiết giỏ hàng
 * Quản lý thông tin từng sản phẩm trong giỏ hàng
 */

import mongoose from "mongoose";

/**
 * Schema chi tiết giỏ hàng
 * @field {ObjectId} cart_id - ID của giỏ hàng chứa item này
 * @field {ObjectId} product_id - ID của sản phẩm
 * @field {ObjectId} variant_id - ID của biến thể sản phẩm
 * @field {number} quantity - Số lượng sản phẩm (mặc định: 1)
 */
const CartItemSchema = new mongoose.Schema(
  {
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", CartItemSchema);