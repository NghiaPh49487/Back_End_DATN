/**
 * Controllers xử lý các thao tác liên quan đến danh mục sản phẩm
 * Bao gồm: lấy danh sách, xem chi tiết, thêm, sửa, xóa danh mục
 */

import Category from '../models/category.js';

/**
 * Lấy danh sách tất cả danh mục
 * Không yêu cầu tham số, trả về toàn bộ danh mục trong DB
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy danh sách danh mục",
            error: error.message
        });
    }
};

/**
 * Lấy thông tin chi tiết một danh mục
 * @param {string} req.params.id ID của danh mục
 */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: "Không tìm thấy danh mục"
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy thông tin danh mục",
            error: error.message
        });
    }
};

/**
 * Tạo danh mục mới
 * @param {Object} req.body Thông tin danh mục
 * - category_id: Mã danh mục (duy nhất)
 * - name: Tên danh mục
 * - description: Mô tả danh mục
 * - image_logo: URL ảnh logo
 */
export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json({
            message: "Tạo danh mục thành công",
            category
        });
    } catch (error) {
        return res.status(400).json({
            message: "Lỗi khi tạo danh mục",
            error: error.message
        });
    }
};

/**
 * Cập nhật thông tin danh mục
 * @param {string} req.params.id ID của danh mục cần cập nhật
 * @param {Object} req.body Thông tin cần cập nhật
 * - name: Tên danh mục mới
 * - description: Mô tả mới
 * - image_logo: URL ảnh logo mới
 */
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({
                message: "Không tìm thấy danh mục"
            });
        }
        return res.status(200).json({
            message: "Cập nhật danh mục thành công",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi cập nhật danh mục",
            error: error.message
        });
    }
};

/**
 * Xóa một danh mục
 * @param {string} req.params.id ID của danh mục cần xóa
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: "Không tìm thấy danh mục"
            });
        }
        return res.status(200).json({
            message: "Xóa danh mục thành công",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xóa danh mục",
            error: error.message
        });
    }
};