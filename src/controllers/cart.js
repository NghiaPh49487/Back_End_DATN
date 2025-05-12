import Cart from "../models/cart";
import CartItem from "../models/cartItem";

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user._id })
            .populate({
                path: 'cart_items',
                populate: [
                    {
                        path: 'product_id',
                        select: 'name'
                    },
                    {
                        path: 'variant_id',
                        model: 'Variant',
                        select: 'color size price image_url'
                    },
                ]
            });

        if (!cart) {
            return res.status(404).json({
                message: "Không tìm thấy giỏ hàng"
            });
        }

        // Chuyển đổi cart thành plain object
        const cartObject = cart.toObject();

        // Tính tổng tiền
        const totalAmount = cartObject.cart_items.reduce((total, item) => {
            const price = item.variant_id ? item.variant_id.price : 0;
            return total + (price * item.quantity);
        }, 0);

        return res.status(200).json({
            message: "Lấy giỏ hàng thành công",
            data: {
                ...cartObject,
                totalAmount
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const user_id = req.user._id;
        const items = Array.isArray(req.body) ? req.body : [req.body];

        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            cart = await Cart.create({
                user_id,
                cart_items: []
            });
        }

        const addedItems = [];

        for (const item of items) {
            const { product_id, variant_id, quantity = 1 } = item;

            let existingItem = await CartItem.findOne({
                cart_id: cart._id,
                product_id,
                variant_id
            });

            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();
                addedItems.push(existingItem);
            } else {
                const newItem = await CartItem.create({
                    cart_id: cart._id,
                    product_id,
                    variant_id,
                    quantity
                });
                // Thêm item vào cart_items array
                cart.cart_items.push(newItem._id);
                addedItems.push(newItem);
            }
        }

        // Lưu cart sau khi cập nhật cart_items
        await cart.save();

        return res.status(200).json({
            message: "Thêm vào giỏ hàng thành công",
            data: addedItems
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findByIdAndUpdate(
            req.params.itemId,
            { quantity },
            { new: true }
        );
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        return res.status(200).json(cartItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const cartItem = await CartItem.findByIdAndDelete(req.params.itemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
