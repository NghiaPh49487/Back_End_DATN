import Stock from "../models/stock";
import StockHistory from "../models/stockHistory";

export const getStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId })
            .populate('product_variant_id');
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        return res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { quantity, reason } = req.body;
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const previousQuantity = stock.quantity;
        stock.quantity = quantity;
        stock.last_updated = Date.now();
        await stock.save();

        await StockHistory.create({
            stock_id: stock._id,
            quantity_change: quantity - previousQuantity,
            reason: reason || "Manual update"
        });

        return res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getStockHistory = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product_variant_id: req.params.variantId });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const history = await StockHistory.find({ stock_id: stock._id })
            .sort({ createdAt: -1 });
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
