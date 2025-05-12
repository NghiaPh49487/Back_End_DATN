import Order from "../models/oder.js";
import OrderItem from "../models/oderItem.js";
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import Stock from '../models/stock.js';
import StockHistory from '../models/stockHistory.js';

export const createOrder = async (req, res) => {
    try {
        // Kiểm tra user authentication
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }

        const user_id = req.user._id;
        const { cart_id } = req.body;

        if (!cart_id) {
            return res.status(400).json({ message: "Cart ID is required" });
        }

        // Kiểm tra giỏ hàng tồn tại và thuộc về user
        const cart = await Cart.findOne({ _id: cart_id })
            .populate({
                path: 'cart_items',
                populate: [
                    {
                        path: 'product_id',
                        select: 'name'
                    },
                    {
                        path: 'variant_id',
                        select: 'price'
                    }
                ]
            });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (!cart.cart_items || cart.cart_items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Kiểm tra số lượng tồn kho trước khi tạo đơn
        for (const item of cart.cart_items) {
            const stock = await Stock.findOne({ product_variant_id: item.variant_id._id });

            if (!stock || stock.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${item.product_id.name} không đủ số lượng trong kho`,
                    available: stock ? stock.quantity : 0,
                    requested: item.quantity
                });
            }
        }

        // Tính tổng giá trị đơn hàng
        let total_price = 0;
        for (const item of cart.cart_items) {
            const price = item.variant_id?.price || 0;
            total_price += price * item.quantity;
        }

        // Tạo đơn hàng mới
        const order = await Order.create({
            user_id,
            cart_id,
            shipping_address: req.user.address || '',
            payment_method: 'COD',
            total_price
        });

        // Tạo các order items và cập nhật số lượng tồn kho
        const orderItemsData = [];
        for (const item of cart.cart_items) {
            // Tạo order item
            const orderItem = {
                order_id: order._id,
                product_id: item.product_id._id,
                variant_id: item.variant_id._id,
                quantity: item.quantity,
                price: item.variant_id.price
            };
            orderItemsData.push(orderItem);

            // Cập nhật số lượng tồn kho
            const stock = await Stock.findOneAndUpdate(
                { product_variant_id: item.variant_id._id },
                { $inc: { quantity: -item.quantity } },
                { new: true }
            );

            // Lưu lịch sử kho
            await StockHistory.create({
                stock_id: stock._id,
                quantity_change: -item.quantity,
                reason: `Order #${order._id}`,
                note: `Khách hàng ${req.user.username} đã mua ${item.quantity} sản phẩm`
            });
        }

        const orderItems = await OrderItem.insertMany(orderItemsData);

        // Xóa giỏ hàng sau khi tạo đơn thành công
        await CartItem.deleteMany({ cart_id });
        await Cart.findByIdAndUpdate(cart_id, { cart_items: [] });

        res.status(201).json({
            message: "Order created successfully",
            order: {
                ...order.toObject(),
                items: orderItems
            }
        });

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id })
            .populate('user_id', 'username email')
            .sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user_id', 'username email')
            .populate({
                path: 'items',
                populate: {
                    path: 'product_id variant_id',
                    select: 'name color size price'
                }
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        // Kiểm tra user authentication
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }

        const orderId = req.params.id;
        const user_id = req.user._id;

        // Tìm đơn hàng cần hủy
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Kiểm tra quyền hạn (chỉ người tạo đơn hoặc admin mới được hủy)
        if (!req.user.isAdmin && order.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({ message: "You don't have permission to cancel this order" });
        }

        // Kiểm tra trạng thái đơn hàng
        const nonCancellableStatuses = ['delivered', 'canceled'];
        if (nonCancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        // Lấy thông tin các mặt hàng trong đơn để hoàn kho
        const orderItems = await OrderItem.find({ order_id: orderId });

        if (orderItems && orderItems.length > 0) {
            // Hoàn lại số lượng vào kho và tạo lịch sử kho
            for (const item of orderItems) {
                // Tìm và cập nhật số lượng trong kho
                const stock = await Stock.findOneAndUpdate(
                    { product_variant_id: item.variant_id },
                    { $inc: { quantity: item.quantity } },
                    { new: true }
                );

                if (stock) {
                    // Tạo lịch sử kho cho việc hoàn số lượng
                    await StockHistory.create({
                        stock_id: stock._id,
                        quantity_change: item.quantity,
                        reason: `Return stock from canceled order #${orderId}`,
                        note: `Order canceled by ${req.user.username}, returned ${item.quantity} items`
                    });
                }
            }
        }

        // Cập nhật trạng thái đơn hàng thành "canceled"
        order.status = 'canceled';
        order.cancel_reason = req.body.cancel_reason || 'Customer requested cancellation';
        order.cancelled_at = new Date();
        order.cancelled_by = user_id;

        await order.save();

        return res.status(200).json({
            message: "Order canceled successfully",
            order
        });

    } catch (error) {
        console.error("Error cancelling order:", error);
        return res.status(500).json({
            message: "Error cancelling order",
            error: error.message
        });
    }
};
