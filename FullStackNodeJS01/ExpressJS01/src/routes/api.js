const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const {
    getProducts,
    getProductById,
    getSimilarProducts,
    getPromotions,
    getNewest,
    getBestSellers,
    getCategories
} = require('../controllers/productController');
const { auth } = require("../middleware/auth");

const apiRoutes = express.Router();

// Public routes (không cần auth)
apiRoutes.get("/products", getProducts);
apiRoutes.get("/products/promotions", getPromotions);
apiRoutes.get("/products/newest", getNewest);
apiRoutes.get("/products/bestsellers", getBestSellers);
apiRoutes.get("/products/:id", getProductById);
apiRoutes.get("/products/:id/similar", getSimilarProducts);
apiRoutes.get("/categories", getCategories);

// Apply auth middleware to all profile routes
apiRoutes.use(auth);

// Profile routes
apiRoutes.get("/profile/me", getProfile)
apiRoutes.put("/profile/me", updateProfile)

module.exports = apiRoutes;
