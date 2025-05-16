/**
 * Controllers xử lý các chức năng xác thực người dùng
 * Bao gồm: đăng ký, đăng nhập, xem và cập nhật thông tin cá nhân
 */

import User from "../models/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Đăng ký tài khoản mới
 * @param {Object} req.body Thông tin đăng ký
 * - username: Tên đăng nhập
 * - email: Email (duy nhất trong hệ thống)
 * - password: Mật khẩu 
 * - full_name: Họ tên
 * - address: Địa chỉ
 * - phone: Số điện thoại
 */
export const register = async (req, res) => {
    try {
        // Lấy thông tin từ request body
        const { username, email, password, full_name, address, phone } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo user mới với ID là timestamp
        const user = await User.create({
            user_id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            full_name,
            address,
            phone
        });

        // Tạo token xác thực với thời hạn 1 ngày
        const token = jwt.sign({ id: user._id }, "nghiant", { expiresIn: "1d" });

        // Trả về thông tin user (không bao gồm password) và token
        return res.status(201).json({
            message: "Đăng ký tài khoản thành công",
            user: { ...user.toObject(), password: undefined },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi đăng ký tài khoản" });
    }
};

/**
 * Đăng nhập vào hệ thống
 * @param {Object} req.body Thông tin đăng nhập
 * - email: Email đã đăng ký
 * - password: Mật khẩu
 */
export const login = async (req, res) => {
    try {
        // Lấy thông tin đăng nhập
        const { email, password } = req.body;
        
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }

        // Tạo token mới
        const token = jwt.sign({ id: user._id }, "nghiant", { expiresIn: "1h" });

        // Trả về thông tin user và token
        return res.status(200).json({
            message: "Đăng nhập thành công",
            user: { ...user.toObject(), password: undefined },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi đăng nhập" });
    }
};

/**
 * Lấy thông tin cá nhân của user đang đăng nhập
 * Yêu cầu đã xác thực bằng token
 */
export const getProfile = async (req, res) => {
    try {
        // Lấy thông tin user từ DB, không bao gồm password
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * Cập nhật thông tin cá nhân
 * @param {Object} req.body Thông tin cần cập nhật
 * Có thể cập nhật: username, full_name, address, phone
 * Không cho phép cập nhật: email, password
 */
export const updateProfile = async (req, res) => {
    try {
        // Loại bỏ password khỏi dữ liệu cập nhật
        const { password, ...updateData } = req.body;
        
        // Cập nhật thông tin và trả về user đã cập nhật
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select("-password");
        
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
