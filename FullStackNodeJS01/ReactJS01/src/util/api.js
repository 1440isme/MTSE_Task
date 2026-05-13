import axios from "./axios.customize";

// Auth APIs
export const getMyProfile = () => axios.get("/api/profile/me");
export const updateMyProfile = (data) => axios.put("/api/profile/me", data);
export const loginApi = (credentials) => axios.post("/auth/login", credentials);
export const registerApi = (data) => axios.post("/auth/register", data);
export const getCurrentSession = () => axios.get("/auth/me");

// Product APIs
export const getProducts = (params) => axios.get("/api/products", { params });
export const getProduct = (id) => axios.get(`/api/products/${id}`);
export const getSimilarProducts = (id) => axios.get(`/api/products/${id}/similar`);
export const getPromotions = () => axios.get("/api/products/promotions");
export const getNewest = () => axios.get("/api/products/newest");
export const getBestSellers = () => axios.get("/api/products/bestsellers");
export const getCategories = () => axios.get("/api/categories");