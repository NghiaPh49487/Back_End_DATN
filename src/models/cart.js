import mongoose from "mongoose";

const cart = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }]
}, { timestamps: true });

export default mongoose.model("Cart", cart);