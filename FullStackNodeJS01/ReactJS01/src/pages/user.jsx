import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../store/slices/authSlice";
import { getMyProfile, updateMyProfile } from "../util/api";
import { 
    User, 
    Edit, 
    Save, 
    X, 
    Loader2, 
    Phone, 
    MapPin, 
    Mail, 
    Calendar,
    Camera,
    ShieldCheck,
    LogOut,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "antd";

const GENDER_OPTIONS = [
    { value: "", label: "Chưa xác định" },
    { value: "true", label: "Nam" },
    { value: "false", label: "Nữ" },
];

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        gender: "",
        avatar: "",
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        setLoading(true);
        getMyProfile()
            .then((res) => {
                if (res.data?.success && res.data?.user) {
                    const u = res.data.user;
                    setProfile(u);
                    setForm({
                        firstName: u.firstName || "",
                        lastName: u.lastName || "",
                        phone: u.phone || "",
                        address: u.address || "",
                        gender: u.gender === true ? "true" : u.gender === false ? "false" : "",
                        avatar: u.avatar || "",
                    });
                }
            })
            .catch(() => {
                messageApi.error("Không thể tải thông tin profile");
            })
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        if (!profile) return;
        setForm({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            phone: profile.phone || "",
            address: profile.address || "",
            gender: profile.gender === true ? "true" : profile.gender === false ? "false" : "",
            avatar: profile.avatar || ""
        });
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                firstName: form.firstName || null,
                lastName: form.lastName || null,
                phone: form.phone || null,
                address: form.address || null,
                gender: form.gender === "" ? null : form.gender === "true",
                avatar: form.avatar || null,
            };

            const res = await updateMyProfile(payload);
            if (res.data?.success) {
                const updated = res.data.user;
                setProfile(updated);
                dispatch(updateProfile(updated));
                messageApi.success("Cập nhật profile thành công!");
                setIsEditing(false);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
            messageApi.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const getDisplayName = () => {
        if (!profile) return "Người dùng";
        const full = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
        return full || profile.name || "Người dùng";
    };

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold animate-pulse">Đang tải thông tin cá nhân...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen py-12 px-6">
            {contextHolder}
            <div className="bg-mesh" />

            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="glass rounded-[40px] p-8 text-center relative overflow-hidden border border-white/50 shadow-2xl shadow-indigo-100">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-violet-600 opacity-10" />
                            
                            <div className="relative mb-6">
                                <div className="w-32 h-32 mx-auto rounded-[40px] border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                                    {profile?.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User size={64} />
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-1/2 translate-x-16 translate-y-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                    <Camera size={18} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-1">{getDisplayName()}</h2>
                            <p className="text-sm font-bold text-indigo-600 mb-4">{profile?.email}</p>
                            
                            <div className="flex flex-col gap-2">
                                <span className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${profile?.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                                    <ShieldCheck size={12} /> {profile?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                </span>
                                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 size={12} /> Tài khoản đã xác thực
                                </span>
                            </div>
                        </div>

                        <div className="glass rounded-[32px] p-6 border border-white/50 space-y-2">
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-black text-sm">
                                <User size={18} /> Hồ sơ của tôi
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-white hover:text-indigo-600 transition-all font-black text-sm group">
                                <Calendar size={18} className="group-hover:text-indigo-600" /> Đơn hàng đã mua
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:bg-white hover:text-indigo-600 transition-all font-black text-sm group">
                                <MapPin size={18} className="group-hover:text-indigo-600" /> Địa chỉ giao hàng
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-sm mt-4 border-t border-slate-100 pt-6">
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-8">
                        <div className="glass rounded-[40px] p-8 lg:p-12 border border-white/50 shadow-2xl shadow-indigo-100">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cài đặt hồ sơ</h1>
                                    <p className="text-slate-400 font-medium">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-sm font-black text-slate-700 hover:bg-indigo-600 hover:text-white transition-all group"
                                    >
                                        <Edit size={16} className="group-hover:rotate-12 transition-transform" /> Chỉnh sửa
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div 
                                        key="view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Họ và tên lót</span>
                                                <p className="text-lg font-bold text-slate-800">{profile?.firstName || '—'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tên</span>
                                                <p className="text-lg font-bold text-slate-800">{profile?.lastName || '—'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email liên hệ</span>
                                                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                    <Mail size={16} className="text-indigo-400" /> {profile?.email}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Số điện thoại</span>
                                                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                    <Phone size={16} className="text-emerald-400" /> {profile?.phone || 'Chưa cập nhật'}
                                                </p>
                                            </div>
                                            <div className="space-y-1 sm:col-span-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Địa chỉ nhận hàng</span>
                                                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                    <MapPin size={16} className="text-rose-400" /> {profile?.address || 'Chưa cập nhật'}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="edit"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSave} 
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ</label>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    value={form.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên</label>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    value={form.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Giới tính</label>
                                                <select
                                                    name="gender"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                                                    value={form.gender}
                                                    onChange={handleChange}
                                                >
                                                    {GENDER_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ</label>
                                                <input
                                                    name="address"
                                                    type="text"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">URL Avatar</label>
                                                <input
                                                    name="avatar"
                                                    type="url"
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    value={form.avatar}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-8 py-4 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
                                                disabled={saving}
                                            >
                                                <X size={18} /> Hủy bỏ
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                                disabled={saving}
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                                {saving ? "Đang lưu..." : "Lưu hồ sơ"}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfilePage;
