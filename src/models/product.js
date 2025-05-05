import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const skuSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    brand: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    specifications: {
        type: Object
    },
    variants: [skuSchema], // Thêm array variants chứa các SKU
    isNewProduct: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);