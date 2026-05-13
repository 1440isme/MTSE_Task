import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../util/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    SlidersHorizontal, 
    ChevronDown, 
    Star, 
    ShoppingBag, 
    ArrowUpDown,
    Check,
    X,
    RotateCcw
} from 'lucide-react';

const ProductCard = ({ product }) => {
    const discountPrice = product.originalPrice
        ? Math.round(product.price * (1 - product.promotion / 100))
        : product.price;

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <Link to={`/product/${product._id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                    <img
                        src={product.images?.[0] || '/icons.svg'}
                        alt={product.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.promotion > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-rose-200">
                                -{product.promotion}%
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-200">
                                New
                            </span>
                        )}
                    </div>

                    {/* Quick Add Button - Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                         <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-colors">
                                <ShoppingBag size={16} />
                                Chi tiết
                            </button>
                         </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={12} 
                                className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                            />
                        ))}
                        <span className="text-[11px] font-bold text-slate-400 ml-1">({product.rating})</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 min-h-[40px] leading-tight group-hover:text-indigo-600 transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mb-3">{product.author}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-indigo-600">
                                {discountPrice.toLocaleString('vi-VN')}đ
                            </span>
                            {product.originalPrice && (
                                <span className="text-[11px] text-slate-400 line-through decoration-rose-400/50">
                                    {product.originalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            )}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                            Đã bán {product.sold}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const FilterPanel = ({ 
    categories, 
    selectedCategory, 
    priceRange, 
    setSelectedCategory, 
    setPriceRange, 
    inStockOnly, 
    setInStockOnly,
    handleApplyFilters,
    setSearchTerm
}) => {

    return (
        <div className="glass rounded-[32px] p-8 sticky top-28 shadow-xl shadow-slate-200/50 border border-white/50">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <SlidersHorizontal size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Bộ lọc</h3>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Filter size={12} />
                    Danh mục
                </label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            !selectedCategory 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                selectedCategory === cat._id
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    <span>Giá (VNĐ)</span>
                </label>
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Từ"
                            value={priceRange.min || ''}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Đến"
                            value={priceRange.max || ''}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>
            </div>

            {/* In Stock Filter */}
            <div className="mb-8">
                <label 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <span className="text-xs font-bold text-slate-600">Chỉ hiển thị có sẵn</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleApplyFilters}
                    className="bg-indigo-600 text-white font-black py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-xs"
                >
                    Áp dụng
                </button>
                <button
                    onClick={() => {
                        setSelectedCategory('');
                        setPriceRange({ min: '', max: '' });
                        setInStockOnly(false);
                        if (typeof setSearchTerm === 'function') setSearchTerm('');
                        // Trigger apply immediately for reset
                        setTimeout(handleApplyFilters, 0);
                    }}
                    className="bg-slate-100 text-slate-600 font-black py-3 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-xs"
                >
                    <RotateCcw size={14} />
                    Làm mới
                </button>

            </div>
        </div>
    );
};


const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: '',
        sort: 'newest',
        page: 1,
        limit: 12
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.category) params.append('category', filters.category);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.inStock) params.append('inStock', filters.inStock);
                if (filters.sort) params.append('sort', filters.sort);
                if (filters.page) params.append('page', filters.page);
                if (filters.limit) params.append('limit', filters.limit);

                const res = await getProducts(params);
                setProducts(res.data.data || []);
                setPagination(res.data.pagination || {
                    page: 1,
                    limit: 12,
                    total: 0,
                    pages: 0
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [filters]);

    useEffect(() => {
        setSelectedCategory(filters.category || '');
        setPriceRange({ min: filters.minPrice || '', max: filters.maxPrice || '' });
        setInStockOnly(filters.inStock === 'true');
    }, [filters.category, filters.minPrice, filters.maxPrice, filters.inStock]);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }, [filters]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('search') || '';
        const newFilters = {
            search: q,
            category: urlParams.get('category') || '',
            minPrice: urlParams.get('minPrice') || '',
            maxPrice: urlParams.get('maxPrice') || '',
            inStock: urlParams.get('inStock') || '',
            sort: urlParams.get('sort') || 'newest',
            page: parseInt(urlParams.get('page')) || 1,
            limit: parseInt(urlParams.get('limit')) || 12
        };
        setFilters(newFilters);
        setSearchTerm(q);
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);


    const handleApplyFilters = () => {
        setFilters({
            ...filters,
            category: selectedCategory,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            inStock: inStockOnly ? 'true' : '',
            page: 1
        });
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Decorations */}
            <div className="bg-mesh" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black text-slate-900 tracking-tight mb-2"
                        >
                            Thư viện <span className="text-indigo-600">Sách</span>
                        </motion.h1>
                        <p className="text-lg font-medium text-slate-400">
                            Khám phá bộ sưu tập tri thức mới nhất ({pagination.total} sản phẩm)
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-[24px] border border-white/50 shadow-sm">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setFilters({ ...filters, search: searchTerm, page: 1 });
                                    }
                                }}
                                className="pl-12 pr-6 py-3 bg-white rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 w-full md:w-64 transition-all"
                            />

                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden md:block" />
                        <div className="relative hidden md:block">
                            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                                className="pl-12 pr-10 py-3 bg-white rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="sold">Bán chạy</option>
                                <option value="rating">Đánh giá cao</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <aside className="lg:col-span-3">
                        <FilterPanel
                            categories={categories}
                            selectedCategory={selectedCategory}
                            priceRange={priceRange}
                            setSelectedCategory={setSelectedCategory}
                            setPriceRange={setPriceRange}
                            inStockOnly={inStockOnly}
                            setInStockOnly={setInStockOnly}
                            handleApplyFilters={handleApplyFilters}
                            setSearchTerm={setSearchTerm}
                        />

                    </aside>

                    <main className="lg:col-span-9">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-slate-400 font-bold animate-pulse">Đang tải tri thức...</p>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence mode='popLayout'>
                                    {products.length > 0 ? (
                                        <motion.div 
                                            layout
                                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                        >
                                            {products.map(product => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-24 glass rounded-[40px]"
                                        >
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                                <ShoppingBag size={40} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
                                            <p className="text-slate-400 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="mt-16 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                                            disabled={filters.page <= 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all font-bold"
                                        >
                                            ←
                                        </button>
                                        
                                        <div className="flex gap-2">
                                            {[...Array(pagination.pages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                                                    className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${
                                                        filters.page === i + 1 
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                                        : "bg-white border border-slate-100 hover:border-indigo-600"
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
                                            disabled={filters.page >= pagination.pages}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all font-bold"
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;