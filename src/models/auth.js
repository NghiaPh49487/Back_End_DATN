/**
 * Model người dùng trong hệ thống
 * Quản lý thông tin tài khoản và quyền truy cập
 */

import mongoose from "mongoose";

/**
 * Schema người dùng
 * @field {string} user_id - ID người dùng (duy nhất)
 * @field {string} username - Tên đăng nhập
 * @field {string} email - Email (duy nhất)
 * @field {string} password - Mật khẩu đã được mã hóa
 * @field {string} full_name - Họ và tên
 * @field {string} address - Địa chỉ
 * @field {string} phone - Số điện thoại
 * @field {string} role - Vai trò (user/admin)
 */
const userSchema = new mongoose.Schema(
  {
    user_id: { 
        type: String, 
        required: [true, 'Mã người dùng là bắt buộc'],  
        unique: true 
    },
    username: { 
        type: String, 
        required: [true, 'Tên đăng nhập là bắt buộc'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email là bắt buộc'], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, 'Mật khẩu là bắt buộc'] 
    },
    full_name: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { 
        type: String, 
        enum: {
            values: ["user", "admin"],
            message: '{VALUE} không phải là quyền hợp lệ'
        }, 
        default: "user" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

