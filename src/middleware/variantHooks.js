import mongoose from 'mongoose';
import Variant from '../models/variant.js';

export const updateProductOnVariantSave = async function(next) {
    try {
        if (this.isNew) {
            const updated = await Variant.findByIdAndUpdate(
                this._id,
                { $set: { product_id: this.product_id } },
                { new: true }
            );
            if (!updated) {
                throw new Error('Không thể cập nhật thông tin biến thể');
            }
        }
        next();
    } catch (error) {
        next(new Error(`Lỗi khi cập nhật biến thể: ${error.message}`));
    }
};