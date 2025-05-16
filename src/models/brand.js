/**
 * Model thương hiệu sản phẩm
 * Quản lý thông tin các thương hiệu và sản phẩm thuộc thương hiệu
 */

import mongoose from "mongoose";

/**
 * Schema thương hiệu
 * @field {string} name - Tên thương hiệu (bắt buộc)
 * @field {string} description - Mô tả thương hiệu
 * @field {Array<ObjectId>} products - Danh sách ID các sản phẩm thuộc thương hiệu
 */
const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);