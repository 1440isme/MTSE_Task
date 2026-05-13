import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { loginApi } from "../util/api";
import { 
    Mail, 
    Lock, 
    LogIn, 
    ArrowRight, 
    Loader2,
    BookOpen,
    Zap,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { message } from "antd";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await loginApi({
                email: form.email,
                password: form.password
            });

            if (res.data?.EC === 0) {
                const { token, user } = res.data;
                dispatch(loginSuccess({ token, user }));
                
                messageApi.success("Đăng nhập thành công!");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                messageApi.error(res.data?.EM || "Email hoặc mật khẩu không chính xác");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
            messageApi.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6">
            {contextHolder}
            <div className="bg-mesh" />

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-[40px] p-10 lg:p-12 shadow-2xl shadow-indigo-100 border border-white/50">
                    <div className="flex flex-col items-center mb-10">
                        <Link to="/" className="mb-6 group">
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                                <BookOpen size={32} />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Chào mừng trở lại</h1>
                        <p className="text-slate-400 font-medium text-center">Đăng nhập để khám phá hàng ngàn tri thức mới mỗi ngày</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                                    placeholder="your@email.com"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                                <Link to="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Quên mật khẩu?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Đăng nhập <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            Chưa có tài khoản? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 ml-1">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Thanh toán bảo mật</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Hỗ trợ 24/7</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
