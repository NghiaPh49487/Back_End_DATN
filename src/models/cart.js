/**
 * Model giỏ hàng
 * Quản lý giỏ hàng của người dùng và các sản phẩm trong giỏ
 */

import mongoose from "mongoose";

/**
 * Schema giỏ hàng
 * @field {ObjectId} user_id - ID của người dùng sở hữu giỏ hàng
 * @field {Array<ObjectId>} cart_items - Danh sách các item trong giỏ hàng
 */
const cart = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cart);