import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import Header from "./components/layout/header";
import UserProfilePage from "./pages/user";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import ProductDetailPage from "./pages/productDetail";

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => {
    const dispatch = useDispatch();

    // Restore session khi app khởi động
    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <div className="app-wrapper">
            <Header />
            <main className="app-content">
                <Routes>
                    {/* Trang chủ */}
                    <Route path="/" element={<HomePage />} />

                    {/* Danh sách sản phẩm */}
                    <Route path="/products" element={<ProductsPage />} />

                    {/* Chi tiết sản phẩm */}
                    <Route path="/product/:id" element={<ProductDetailPage />} />

                    {/* Login/Register */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* User Profile — cần đăng nhập */}
                    <Route
                        path="/user/profile"
                        element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;