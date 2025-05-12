import StockHistory from "../models/stockHistory";

export const getAllStockHistory = async (req, res) => {
    try {
        const history = await StockHistory.find()
            .populate('stock_id')
            .sort({ createdAt: -1 });
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getStockHistoryById = async (req, res) => {
    try {
        const history = await StockHistory.findById(req.params.id)
            .populate('stock_id');
        if (!history) {
            return res.status(404).json({ message: "Stock history not found" });
        }
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteStockHistory = async (req, res) => {
    try {
        const history = await StockHistory.findByIdAndDelete(req.params.id);
        if (!history) {
            return res.status(404).json({ message: "Stock history not found" });
        }
        return res.status(200).json({ message: "Stock history deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
