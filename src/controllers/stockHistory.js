/**
 * Controllers xử lý các thao tác liên quan đến lịch sử kho hàng
 * Bao gồm: xem lịch sử, xem chi tiết và xóa lịch sử
 */

import StockHistory from "../models/stockHistory";

/**
 * Lấy toàn bộ lịch sử thay đổi tồn kho
 * Sắp xếp theo thời gian mới nhất
 */
export const getAllStockHistory = async (req, res) => {
    try {
        const history = await StockHistory.find()
            .populate('stock_id')
            .sort({ createdAt: -1 });
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy lịch sử tồn kho",
            error: error.message
        });
    }
};

/**
 * Lấy chi tiết một bản ghi lịch sử
 * @param {string} req.params.id ID của bản ghi lịch sử
 */
export const getStockHistoryById = async (req, res) => {
    try {
        const history = await StockHistory.findById(req.params.id)
            .populate('stock_id');
        if (!history) {
            return res.status(404).json({
                message: "Không tìm thấy bản ghi lịch sử"
            });
        }
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy chi tiết lịch sử",
            error: error.message
        });
    }
};

/**
 * Xóa một bản ghi lịch sử
 * @param {string} req.params.id ID của bản ghi lịch sử cần xóa
 * Lưu ý: Chỉ nên xóa trong trường hợp đặc biệt
 */
export const deleteStockHistory = async (req, res) => {
    try {
        const history = await StockHistory.findByIdAndDelete(req.params.id);
        if (!history) {
            return res.status(404).json({
                message: "Không tìm thấy bản ghi lịch sử"
            });
        }
        return res.status(200).json({
            message: "Xóa bản ghi lịch sử thành công"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xóa bản ghi lịch sử",
            error: error.message
        });
    }
};
