import mongoose from "mongoose";
import { updateProductOnVariantSave } from "../middleware/variantMiddleware.js";

const variantSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    color: { type: String },
    size: { type: String },
    image_url: { type: String },
    price: { type: Number },
    import_price: { type: Number }
}, { timestamps: true });

variantSchema.pre('save', updateProductOnVariantSave);

export default mongoose.model("Variant", variantSchema);