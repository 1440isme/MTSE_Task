import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getProduct, getSimilarProducts } from '../util/api.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Star, 
    ShoppingBag, 
    Zap, 
    ShieldCheck, 
    Truck, 
    RotateCcw,
    Plus,
    Minus,
    Heart,
    Share2,
    BookOpen
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const productRes = await getProduct(id);
                setProduct(productRes.data.data);

                const similarRes = await getSimilarProducts(id);
                setSimilarProducts(similarRes.data.data || []);
            } catch (err) {
                setError('Không thể tải sản phẩm');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold animate-pulse">Đang mở trang sách...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                    <BookOpen size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{error || 'Sản phẩm không tồn tại'}</h2>
                <p className="text-slate-500 mb-8 max-w-md">Chúng tôi không tìm thấy cuốn sách này. Có thể nó đã được mượn hết hoặc chuyển sang thư mục khác.</p>
                <Link to="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <ChevronLeft size={20} /> Về danh sách sản phẩm
                </Link>
            </div>
        );
    }

    const discountPrice = product.originalPrice
        ? Math.round(product.price * (1 - product.promotion / 100))
        : product.price;
    const savings = product.originalPrice ? product.originalPrice - product.price : 0;

    return (
        <div className="relative min-h-screen">
            <div className="bg-mesh" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Breadcrumbs */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ChevronLeft size={14} />
                        </div>
                        Quay lại cửa hàng
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Image Gallery */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="glass rounded-[40px] p-4 shadow-2xl shadow-indigo-100/50">
                            <Swiper
                                effect={'fade'}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[EffectFade, Navigation, Pagination, Thumbs]}
                                className="aspect-[3/4] rounded-[32px] overflow-hidden"
                            >
                                {product.images?.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={img} alt={product.title} className="w-full h-full object-cover" />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                            <BookOpen size={80} />
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>

                        {product.images?.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={4}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="thumbs-swiper"
                            >
                                {product.images.map((img, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer">
                                        <div className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent swiper-slide-thumb-active:border-indigo-600 transition-all">
                                            <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-7"
                    >
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {product.category?.name || 'Sách'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                        ))}
                                        <span className="text-xs font-bold text-slate-400 ml-1">({product.rating.toFixed(1)})</span>
                                    </div>
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                    <span className="text-xs font-bold text-slate-400">Đã bán {product.sold}</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                                    {product.title}
                                </h1>
                                <p className="text-lg font-bold text-indigo-600 mb-6">Tác giả: <span className="text-slate-900 underline decoration-indigo-200 underline-offset-4">{product.author}</span></p>
                            </div>

                            <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50">
                                <div className="flex items-end gap-4 mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá ưu đãi</span>
                                        <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                                            {discountPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    {product.originalPrice && (
                                        <div className="flex flex-col pb-1">
                                            <span className="text-sm text-slate-400 line-through font-medium">
                                                {product.originalPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg mt-1">
                                                Tiết kiệm {product.promotion}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-6 mb-8">
                                    <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-14 text-center font-black text-slate-800">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="text-sm font-bold text-slate-400">
                                        {product.stock > 0 ? (
                                            <span className="text-emerald-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Còn {product.stock} sản phẩm
                                            </span>
                                        ) : (
                                            <span className="text-rose-500">Hết hàng</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        disabled={product.stock === 0}
                                        className="bg-slate-900 text-white px-8 py-5 rounded-[20px] font-black text-base flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                                    >
                                        <ShoppingBag size={20} /> Thêm vào giỏ
                                    </button>
                                    <button 
                                        disabled={product.stock === 0}
                                        className="bg-indigo-600 text-white px-8 py-5 rounded-[20px] font-black text-base flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                    >
                                        <Zap size={20} /> Mua ngay
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                    <Truck size={24} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-slate-900 uppercase">Miễn phí giao hàng</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                    <ShieldCheck size={24} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-slate-900 uppercase">Chính hãng 100%</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                    <RotateCcw size={24} className="text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-slate-900 uppercase">Đổi trả 7 ngày</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all">
                                    <Heart size={24} className="text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-slate-900 uppercase">Yêu thích</span>
                                </div>
                            </div>

                            <div className="glass rounded-[32px] p-8 border border-white/50">
                                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <BookOpen size={20} className="text-indigo-600" /> Giới thiệu sách
                                </h3>
                                <div className="text-slate-600 leading-relaxed space-y-4">
                                    {product.description?.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-24"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sách tương tự bạn thích</h2>
                            <Link to="/products" className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                                Xem thêm <Zap size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {similarProducts.slice(0, 5).map(prod => (
                                <Link 
                                    key={prod._id} 
                                    to={`/product/${prod._id}`}
                                    className="group bg-white rounded-3xl border border-slate-100 p-3 hover:shadow-xl transition-all duration-500"
                                >
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                                        <img src={prod.images?.[0] || '/icons.svg'} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {prod.promotion > 0 && (
                                            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                                                -{prod.promotion}%
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-xs mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {prod.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-indigo-600">
                                        {prod.price.toLocaleString('vi-VN')}đ
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;