import Variant from "../models/variant";
import Stock from "../models/stock";
import StockHistory from "../models/stockHistory";

export const createVariant = async (req, res) => {
    try {
        const variant = await Variant.create(req.body);

        // Create initial stock entry
        const stock = await Stock.create({
            product_variant_id: variant._id,
            quantity: req.body.initial_stock || 0
        });

        // Record stock history if initial stock is provided
        if (req.body.initial_stock) {
            await StockHistory.create({
                stock_id: stock._id,
                quantity_change: req.body.initial_stock,
                reason: "Initial stock"
            });
        }

        return res.status(201).json(variant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateVariant = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        return res.status(200).json(variant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllVariants = async (req, res) => {
    try {
        const variants = await Variant.find()
            .populate('product_id');

        // Get stock information for all variants
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
        return res.status(500).json({ message: error.message });
    }
};

export const getVariant = async (req, res) => {
    try {
        const variant = await Variant.findById(req.params.id)
            .populate('product_id');

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        const stock = await Stock.findOne({ product_variant_id: variant._id });

        return res.status(200).json({
            ...variant.toObject(),
            current_stock: stock ? stock.quantity : 0
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteVariant = async (req, res) => {
    try {
        const variant = await Variant.findByIdAndDelete(req.params.id);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // Delete associated stock and stock history
        const stock = await Stock.findOne({ product_variant_id: variant._id });
        if (stock) {
            await StockHistory.deleteMany({ stock_id: stock._id });
            await stock.remove();
        }

        return res.status(200).json({ message: "Variant deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const updateStock = async (req, res) => {
    try {
        const { quantity_change, reason } = req.body;
        const stock = await Stock.findOne({ product_variant_id: req.params.id });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        // Kiểm tra và ngăn không cho số lượng âm
        if (stock.quantity + quantity_change < 0) {
            return res.status(400).json({ message: "Không đủ hàng" });
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

        // Kiểm tra và trả về thông báo tương ứng
        let message = "";
        if (stock.quantity === 0) {
            message = "Kho đã hết hàng";
        } else if (stock.quantity < 5) {
            message = "Kho sắp hết hàng, cần nhập thêm";
        } else {
            message = stock.quantity + " sản phẩm còn lại trong kho";
        }

        return res.status(200).json({
            stock,
            message,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
