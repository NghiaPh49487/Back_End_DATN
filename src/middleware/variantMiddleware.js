import mongoose from "mongoose";

export const checkDuplicateSKU = async (req, res, next) => {
    try {
        const { sku } = req.body;
        const variantId = req.params.id; // For update operations

        const query = { sku };
        if (variantId) {
            // Trong trường hợp update, loại trừ variant hiện tại khỏi việc kiểm tra
            query._id = { $ne: variantId };
        }

        const existingVariant = await mongoose.model('Variant').findOne(query);
        
        if (existingVariant) {
            return res.status(400).json({
                errors: [{
                    field: 'sku',
                    message: 'Mã SKU đã tồn tại trong hệ thống'
                }]
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            errors: [{
                field: 'server',
                message: 'Lỗi khi kiểm tra mã SKU'
            }]
        });
    }
};
