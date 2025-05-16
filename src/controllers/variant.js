/**
 * Controllers xử lý các thao tác liên quan đến biến thể sản phẩm
 * Bao gồm: quản lý biến thể và tồn kho của biến thể
 */

import Variant from "../models/variant";
import Stock from "../models/stock";
import StockHistory from "../models/stockHistory";

/**
 * Tạo biến thể mới cho sản phẩm
 * @param {Object} req.body Thông tin biến thể
 * - product_id: ID sản phẩm
 * - sku: Mã SKU (duy nhất)
 * - color: Màu sắc
 * - size: Kích thước
 * - price: Giá bán
 * - import_price: Giá nhập
 * - initial_stock: Số lượng tồn kho ban đầu (không bắt buộc)
 */
export const createVariant = async (req, res) => {
    try {
        // Tạo biến thể mới
        const variant = await Variant.create(req.body);

        // Tạo bản ghi tồn kho ban đầu
        const stock = await Stock.create({
            product_variant_id: variant._id,
            quantity: req.body.initial_stock || 0
        });

        // Ghi lại lịch sử nếu có số lượng ban đầu
        if (req.body.initial_stock) {
            await StockHistory.create({
                stock_id: stock._id,
                quantity_change: req.body.initial_stock,
                reason: "Số lượng ban đầu"
            });
        }

        return res.status(201).json(variant);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi tạo biến thể",
            error: error.message
        });
    }
};

/**
 * Cập nhật thông tin biến thể
 * @param {string} req.params.id ID của biến thể
 * @param {Object} req.body Thông tin cần cập nhật
 * Có thể cập nhật: color, size, price, import_price
 */
export const updateVariant = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!variant) {
            return res.status(404).json({
                message: "Không tìm thấy biến thể"
            });
        }

        return res.status(200).json(variant);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi cập nhật biến thể",
            error: error.message
        });
    }
};

/**
 * Lấy danh sách tất cả biến thể
 * Kèm theo thông tin sản phẩm và số lượng tồn kho
 */
export const getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.find()
            .populate('product_id');

        // Thêm thông tin tồn kho cho mỗi biến thể
        const variantsWithStock = await Promise.all(
            variants.map(async (variant) => {
                const stock = await Stock.findOne({ product_variant_id: variant._id });
                return {
                    ...variant.toObject(),
                    current_stock: stock ? stock.quantity : 0
                };
            })
        );

        return res.status(200).json(variantsWithStock);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy danh sách biến thể",
            error: error.message
        });
    }
};

/**
 * Lấy thông tin chi tiết một biến thể
 * @param {string} req.params.id ID của biến thể
 * Kèm theo thông tin sản phẩm và số lượng tồn kho
 */
export const getVariant = async (req, res) => {
    try {
        const variant = await Variant.findById(req.params.id)
            .populate('product_id');

        if (!variant) {
            return res.status(404).json({
                message: "Không tìm thấy biến thể"
            });
        }

        const stock = await Stock.findOne({ product_variant_id: variant._id });

        return res.status(200).json({
            ...variant.toObject(),
            current_stock: stock ? stock.quantity : 0
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy thông tin biến thể",
            error: error.message
        });
    }
};

/**
 * Xóa một biến thể
 * @param {string} req.params.id ID của biến thể cần xóa
 * Đồng thời xóa thông tin tồn kho và lịch sử
 */
export const deleteVariant = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndDelete(req.params.id);

        if (!variant) {
            return res.status(404).json({
                message: "Không tìm thấy biến thể"
            });
        }

        // Xóa thông tin tồn kho và lịch sử liên quan
        const stock = await Stock.findOne({ product_variant_id: variant._id });
        if (stock) {
            await StockHistory.deleteMany({ stock_id: stock._id });
            await stock.remove();
        }

        return res.status(200).json({
            message: "Xóa biến thể thành công"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xóa biến thể",
            error: error.message
        });
    }
};

/**
 * Cập nhật số lượng tồn kho của biến thể
 * @param {string} req.params.id ID của biến thể
 * @param {Object} req.body Thông tin cập nhật
 * - quantity_change: Số lượng thay đổi (+/-)
 * - reason: Lý do thay đổi
 */
export const updateStock = async (req, res) => {
    try {
        const { quantity_change, reason } = req.body;
        const stock = await Stock.findOne({ product_variant_id: req.params.id });

        if (!stock) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin tồn kho"
            });
        }

        // Kiểm tra số lượng tồn kho sau khi thay đổi
        if (stock.quantity + quantity_change < 0) {
            return res.status(400).json({
                message: "Không đủ hàng trong kho"
            });
        }

        // Cập nhật số lượng
        stock.quantity += quantity_change;
        stock.last_updated = Date.now();
        await stock.save();

        // Ghi lại lịch sử
        await StockHistory.create({
            stock_id: stock._id,
            quantity_change,
            reason
        });

        // Chuẩn bị thông báo phù hợp
        let message = "";
        if (stock.quantity === 0) {
            message = "Kho đã hết hàng";
        } else if (stock.quantity < 5) {
            message = "Kho sắp hết hàng, cần nhập thêm";
        } else {
            message = `${stock.quantity} sản phẩm còn lại trong kho`;
        }

        return res.status(200).json({
            stock,
            message
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi cập nhật tồn kho",
            error: error.message
        });
    }
};
