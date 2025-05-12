import User from "../models/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { username, email, password, full_name, address, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            user_id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            full_name,
            address,
            phone
        });

        const token = jwt.sign({ id: user._id }, "nghiant", { expiresIn: "1d" });

        return res.status(201).json({
            message: "User created successfully",
            user: { ...user.toObject(), password: undefined },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, "nghiant", { expiresIn: "1d" });

        return res.status(200).json({
            message: "Login successful",
            user: { ...user.toObject(), password: undefined },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
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
