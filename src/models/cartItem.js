import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
    quantity: { type: Number, default: 1 }
}, { timestamps: true });
export default mongoose.model("CartItem", CartItemSchema);