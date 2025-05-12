import mongoose from "mongoose";
import Variant from '../models/variant.js';

export const updateProductOnVariantSave = async function(next) {
    try {
        if (this.isNew) {
            const Product = mongoose.model('Product');
            await Product.findByIdAndUpdate(
                this.product_id,
                { $push: { variants: this._id } },
                { new: true }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const checkDuplicateSKU = async (req, res, next) => {
    try {
        const { sku } = req.body;
        const variantId = req.params.id; // For update operations

        const query = { sku };
        if (variantId) {
            // Trong trường hợp update, loại trừ variant hiện tại khỏi việc kiểm tra
            query._id = { $ne: variantId };
        }

        const existingVariant = await Variant.findOne(query);
        
        if (existingVariant) {
            return res.status(400).json({
                errors: [{
                    field: 'sku',
                    message: 'SKU already exists'
                }]
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            errors: [{
                field: 'server',
                message: 'Internal server error while checking SKU'
            }]
        });
    }
};
