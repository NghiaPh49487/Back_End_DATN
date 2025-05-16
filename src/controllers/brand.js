/**
 * Controllers xử lý các thao tác liên quan đến thương hiệu
 * Bao gồm: lấy danh sách, xem chi tiết, thêm, sửa, xóa thương hiệu
 */

import Brand from "../models/brand";

/**
 * Lấy danh sách tất cả thương hiệu
 * Không yêu cầu tham số, trả về toàn bộ thương hiệu trong DB
 */
export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        return res.status(200).json(brands);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Lấy thông tin chi tiết một thương hiệu
 * @param {string} req.params.id ID của thương hiệu
 */
export const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
        }
        return res.status(200).json(brand);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin thương hiệu" });
    }
};

/**
 * Tạo thương hiệu mới
 * @param {Object} req.body Thông tin thương hiệu
 * - name: Tên thương hiệu (bắt buộc)
 * - description: Mô tả thương hiệu
 */
export const createBrand = async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        return res.status(201).json({
            message: "Tạo thương hiệu thành công",
            data: brand
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi tạo thương hiệu mới" });
    }
};

/**
 * Cập nhật thông tin thương hiệu
 * @param {string} req.params.id ID của thương hiệu cần cập nhật
 * @param {Object} req.body Thông tin cần cập nhật
 * - name: Tên thương hiệu mới
 * - description: Mô tả mới
 */
export const updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }  // Trả về dữ liệu sau khi cập nhật
        );
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        return res.status(200).json(brand);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Xóa một thương hiệu
 * @param {string} req.params.id ID của thương hiệu cần xóa
 */
export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
        }
        return res.status(200).json({ message: "Xóa thương hiệu thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi xóa thương hiệu" });
    }
};
