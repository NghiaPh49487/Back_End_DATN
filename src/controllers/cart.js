/**
 * Controllers xử lý các thao tác liên quan đến giỏ hàng
 * Bao gồm: xem giỏ hàng, thêm sản phẩm, cập nhật số lượng, xóa sản phẩm
 */

import Cart from "../models/cart";
import CartItem from "../models/cartItem";

/**
 * Lấy thông tin giỏ hàng của người dùng hiện tại
 * Tự động tính tổng tiền và lấy thông tin chi tiết sản phẩm
 */
export const getCart = async (req, res) => {
    try {
        // Tìm giỏ hàng của user và populate thông tin sản phẩm
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

        // Chuyển đổi cart thành plain object để dễ xử lý
        const cartObject = cart.toObject();

        // Tính tổng tiền của giỏ hàng
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

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object|Array} req.body Thông tin sản phẩm cần thêm
 * Có thể thêm một hoặc nhiều sản phẩm cùng lúc
 * - product_id: ID sản phẩm
 * - variant_id: ID biến thể
 * - quantity: Số lượng (mặc định: 1)
 */
export const addToCart = async (req, res) => {
    try {
        const user_id = req.user._id;
        // Chuyển đổi input thành mảng để xử lý đồng nhất
        const items = Array.isArray(req.body) ? req.body : [req.body];

        // Tìm hoặc tạo giỏ hàng cho user
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            cart = await Cart.create({
                user_id,
                cart_items: []
            });
        }

        const addedItems = [];

        // Xử lý từng sản phẩm
        for (const item of items) {
            const { product_id, variant_id, quantity = 1 } = item;

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            let existingItem = await CartItem.findOne({
                cart_id: cart._id,
                product_id,
                variant_id
            });

            if (existingItem) {
                // Nếu đã có thì cộng thêm số lượng
                existingItem.quantity += quantity;
                await existingItem.save();
                addedItems.push(existingItem);
            } else {
                // Nếu chưa có thì tạo mới
                const newItem = await CartItem.create({
                    cart_id: cart._id,
                    product_id,
                    variant_id,
                    quantity
                });
                cart.cart_items.push(newItem._id);
                addedItems.push(newItem);
            }
        }

        // Lưu giỏ hàng sau khi cập nhật
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

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string} req.params.itemId ID của cart item cần cập nhật
 * @param {number} req.body.quantity Số lượng mới
 */
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

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} req.params.itemId ID của cart item cần xóa
 */
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
