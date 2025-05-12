import Brand from "../models/brand";

export const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        return res.status(200).json(brands);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        return res.status(200).json(brand);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createBrand = async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        return res.status(201).json(brand);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        return res.status(200).json(brand);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        return res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
