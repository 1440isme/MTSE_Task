const Product = require('../models/product.js');
const Category = require('../models/category.js');

// Lấy tất cả sản phẩm với filter, search, sort, pagination
exports.getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            inStock,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        const query = {};

        // Search theo title, author, description
        if (search) {
            query.$text = { $search: search };
        }

        // Filter theo category
        if (category) {
            query.category = category;
        }

        // Filter theo khoảng giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter theo tồn kho
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        } else if (inStock === 'false') {
            query.stock = { $lte: 0 };
        }

        // Sort
        let sortOption = { createdAt: -1 }; // Mặc định: mới nhất
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'sold') sortOption = { sold: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('category', 'name slug')
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy sản phẩm tương tự (cùng danh mục)
exports.getSimilarProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại'
            });
        }

        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        })
            .populate('category', 'name slug')
            .limit(4);

        res.json({
            success: true,
            data: similarProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy sản phẩm khuyến mãi
exports.getPromotions = async (req, res) => {
    try {
        const products = await Product.find({ promotion: { $gt: 0 } })
            .populate('category', 'name slug')
            .sort({ promotion: -1 })
            .limit(8);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy sản phẩm mới nhất
exports.getNewest = async (req, res) => {
    try {
        const products = await Product.find({ isNew: true })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .limit(8);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy sản phẩm bán chạy
exports.getBestSellers = async (req, res) => {
    try {
        const products = await Product.find({ isBestSeller: true })
            .populate('category', 'name slug')
            .sort({ sold: -1 })
            .limit(8);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy tất cả danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};