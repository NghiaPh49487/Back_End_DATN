/**
 * Controllers xử lý các thao tác liên quan đến kho hàng
 * Bao gồm: quản lý số lượng tồn kho và lịch sử nhập xuất
 */

import Stock from "../models/stock";
import StockHistory from "../models/stockHistory";

/**
 * Lấy thông tin tồn kho của một biến thể sản phẩm
 * @param {string} req.params.variantId ID của biến thể sản phẩm
 */
export const getStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId })
            .populate('product_variant_id');
        if (!stock) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin tồn kho"
            });
        }
        return res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy thông tin tồn kho",
            error: error.message
        });
    }
};

/**
 * Cập nhật số lượng tồn kho
 * @param {string} req.params.variantId ID của biến thể sản phẩm
 * @param {Object} req.body Thông tin cập nhật
 * - quantity: Số lượng mới
 * - reason: Lý do cập nhật (không bắt buộc)
 */
export const updateStock = async (req, res) => {
    try {
        const { quantity, reason } = req.body;
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId });

        if (!stock) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin tồn kho"
            });
        }

        // Lưu số lượng cũ để tính thay đổi
        const previousQuantity = stock.quantity;
        stock.quantity = quantity;
        stock.last_updated = Date.now();
        await stock.save();

        // Ghi lại lịch sử thay đổi
        await StockHistory.create({
            stock_id: stock._id,
            quantity_change: quantity - previousQuantity,
            reason: reason || "Cập nhật thủ công"
        });

        return res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi cập nhật tồn kho",
            error: error.message
        });
    }
};

/**
 * Lấy lịch sử thay đổi tồn kho của một biến thể
 * @param {string} req.params.variantId ID của biến thể sản phẩm
 * Sắp xếp theo thời gian mới nhất
 */
export const getStockHistory = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId });
        if (!stock) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin tồn kho"
            });
        }

        const history = await StockHistory.find({ stock_id: stock._id })
            .sort({ createdAt: -1 });
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy lịch sử tồn kho",
            error: error.message
        });
    }
};
