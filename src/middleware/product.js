import mongoose from 'mongoose';
export const updateCategoryAndBrandOnProductSave = async function(next) {
    try {
        // Lưu this context
        const product = this;

        // Cập nhật Brand
        if (product.brand) {
            await mongoose.model('Brand').findByIdAndUpdate(
                product.brand,
                { $push: { products: product._id } }
            );
        }

        // Cập nhật Category 
        if (product.category) {
            await mongoose.model('Category').findByIdAndUpdate(
                product.category,
                { $push: { products: product._id } }
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};