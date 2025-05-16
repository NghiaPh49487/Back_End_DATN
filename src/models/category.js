/**
 * Model danh mục sản phẩm
 * Quản lý các danh mục và sản phẩm thuộc danh mục
 */

import mongoose from "mongoose";

/**
 * Schema danh mục
 * @field {string} category_id - Mã danh mục (duy nhất)
 * @field {string} name - Tên danh mục
 * @field {string} description - Mô tả danh mục
 * @field {string} image_logo - URL ảnh logo danh mục
 * @field {Array<ObjectId>} products - Danh sách ID các sản phẩm thuộc danh mục
 */
const categorySchema = new mongoose.Schema(
  {
    category_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image_logo: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
