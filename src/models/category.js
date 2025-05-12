import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image_logo: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
