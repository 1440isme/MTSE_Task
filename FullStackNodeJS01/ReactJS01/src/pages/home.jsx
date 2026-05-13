import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPromotions, getNewest, getBestSellers } from '../util/api.js';
import { motion } from 'framer-motion';
import { 
    Sparkles, 
    Flame, 
    Trophy, 
    ArrowRight, 
    Star, 
    ShoppingBag,
    BookOpen,
    Zap
} from 'lucide-react';

const ProductCard = ({ product }) => {
    const discountPrice = product.originalPrice
        ? Math.round(product.price * (1 - product.promotion / 100))
        : product.price;

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group relative bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
            <Link to={`/product/${product._id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                    <img
                        src={product.images?.[0] || '/icons.svg'}
                        alt={product.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {product.promotion > 0 && (
                        <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase shadow-lg shadow-rose-200">
                            -{product.promotion}%
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-400">{product.rating}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400 mb-2">{product.author}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">
                            {discountPrice.toLocaleString('vi-VN')}đ
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ShoppingBag size={14} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const SectionTitle = ({ title, icon: Icon, linkTo, colorClass }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${colorClass} shadow-lg shadow-current/10`}>
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        {linkTo && (
            <Link to={linkTo} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all">
                Xem tất cả <ArrowRight size={16} />
            </Link>
        )}
    </div>
);

const HomePage = () => {
    const [promotions, setPromotions] = useState([]);
    const [newest, setNewest] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [promoRes, newestRes, bestRes] = await Promise.all([
                    getPromotions(),
                    getNewest(),
                    getBestSellers()
                ]);
                setPromotions(promoRes.data.data || []);
                setNewest(newestRes.data.data || []);
                setBestsellers(bestRes.data.data || []);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold animate-pulse">Chào mừng bạn đến với thế giới tri thức...</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            <div className="bg-mesh" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[40px] overflow-hidden mb-20 shadow-2xl shadow-indigo-100"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800" />
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
                        <div className="text-white">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10"
                            >
                                <Zap size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-black uppercase tracking-wider">Ưu đãi mùa hè lên tới 50%</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight"
                            >
                                Khám Phá <br /> <span className="text-amber-400">Tri Thức</span> Mới
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-indigo-100 mb-10 max-w-md font-medium"
                            >
                                Nhà sách online lớn nhất Việt Nam với hơn 100,000 đầu sách đa dạng thể loại.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    to="/products"
                                    className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-amber-400 hover:text-indigo-900 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2"
                                >
                                    Sách Phổ Biến <ArrowRight size={18} />
                                </Link>
                                <div className="flex -space-x-3 items-center">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-200 overflow-hidden shadow-lg">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                        </div>
                                    ))}
                                    <span className="ml-4 text-xs font-bold text-indigo-200">+2k độc giả đã tin dùng</span>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="hidden lg:flex justify-center"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-amber-400/20 blur-3xl rounded-full" />
                                <div className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-[48px] border border-white/20 shadow-2xl">
                                    <BookOpen size={240} className="text-white" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Promotions */}
                {promotions.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <SectionTitle 
                            title="Khuyến mãi Hot" 
                            icon={Flame} 
                            linkTo="/products?sort=price_desc"
                            colorClass="bg-rose-50 text-rose-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {promotions.slice(0, 5).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Newest */}
                {newest.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <SectionTitle 
                            title="Mới cập bến" 
                            icon={Sparkles} 
                            linkTo="/products?sort=newest"
                            colorClass="bg-emerald-50 text-emerald-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {newest.slice(0, 5).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Best Sellers */}
                {bestsellers.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <SectionTitle 
                            title="Bán chạy nhất" 
                            icon={Trophy} 
                            linkTo="/products?sort=sold"
                            colorClass="bg-indigo-50 text-indigo-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {bestsellers.slice(0, 5).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
};

export default HomePage;