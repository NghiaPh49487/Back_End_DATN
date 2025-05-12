import Review from "../models/review";

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 });
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createReview = async (req, res) => {
    try {
        const { rating, comment, product_id } = req.body;
        const review = await Review.create({
            user_id: req.user._id,
            product_id,
            rating,
            comment
        });

        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const review = await Review.findOneAndUpdate(
            {
                _id: req.params.id,
                user_id: req.user._id
            },
            req.body,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
