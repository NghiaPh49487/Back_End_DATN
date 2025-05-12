import mongoose from "mongoose";

const oderItemSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Variant',
        required: true 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });
export default mongoose.model("OrderItem", oderItemSchema);