import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { 
    User, 
    LogOut, 
    LogIn, 
    UserPlus, 
    ShoppingBag, 
    Search, 
    Menu,
    Home,
    BookOpen
} from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const getDisplayName = () => {
        if (!user) return "";
        const full = [user.firstName, user.lastName].filter(Boolean).join(" ");
        return full || user.name || "";
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {/* Logo */}
                <Link to="/" className="app-header__logo group">
                    <div className="logo-icon group-hover:rotate-12 transition-transform duration-300">
                        <BookOpen size={20} />
                    </div>
                    <span className="logo-text tracking-tighter">Book<span className="text-indigo-600">Store</span></span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link to="/" className={`nav-link flex items-center gap-2 ${isActive('/') ? 'active' : ''}`}>
                        <Home size={16} /> Trang chủ
                    </Link>
                    <Link to="/products" className={`nav-link flex items-center gap-2 ${isActive('/products') ? 'active' : ''}`}>
                        <ShoppingBag size={16} /> Cửa hàng
                    </Link>
                    {isAuthenticated && (
                        <Link to="/user/profile" className={`nav-link flex items-center gap-2 ${isActive('/user/profile') ? 'active' : ''}`}>
                            <User size={16} /> Cá nhân
                        </Link>
                    )}
                </nav>

                {/* Search / Auth */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link to="/user/profile" className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} />
                                    )}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Xin chào,</p>
                                    <p className="text-sm font-black text-slate-800 leading-none">{getDisplayName()}</p>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
                                title="Đăng xuất"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                <UserPlus size={16} /> Đăng ký
                            </Link>
                        </div>
                    )}
                    <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
