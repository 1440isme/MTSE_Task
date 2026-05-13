const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/category.js');
const Product = require('./models/product.js');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL || 'mongodb://localhost:27017/bookstore');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const categories = [
    { name: 'Văn học', description: 'Sách văn học, tiểu thuyết, thơ, kịch', slug: 'van-hoc' },
    { name: 'Kinh tế', description: 'Sách kinh tế, tài chính, đầu tư, quản trị', slug: 'kinh-te' },
    { name: 'Kỹ năng sống', description: 'Sách phát triển bản thân, kỹ năng sống, tâm lý học', slug: 'ky-nang-song' }
];

const products = [
    {
        title: 'Nhà giả kim',
        author: 'Paulo Coelho',
        description: 'Một tác phẩm phiêu lưu tinh thần về cuộc hành trình tìm kiếm bản thân và ý nghĩa của cuộc sống.',
        price: 120000,
        originalPrice: 150000,
        images: [
            'https://picsum.photos/seed/book1/400/600',
            'https://picsum.photos/seed/book1b/400/600'
        ],
        categoryName: 'Văn học',
        stock: 15, sold: 85, rating: 4.8, promotion: 20, isNew: false, isBestSeller: true, isFeatured: true
    },
    {
        title: 'Tuổi trẻ đáng giá bao nhiêu',
        author: 'Rosie Nguyễn',
        description: 'Cuốn sách về những trải nghiệm, bài học từ tuổi trẻ đến thành đạt trong cuộc sống và sự nghiệp.',
        price: 95000,
        originalPrice: 120000,
        images: [
            'https://picsum.photos/seed/book2/400/600',
            'https://picsum.photos/seed/book2b/400/600'
        ],
        categoryName: 'Kỹ năng sống',
        stock: 8, sold: 120, rating: 4.6, promotion: 15, isNew: true, isBestSeller: true, isFeatured: true
    },
    {
        title: 'Bí mật',
        author: 'Rhonda Byrne',
        description: 'Cuốn sách khám phá quy luật hấp dẫn và cách áp dụng nó để thay đổi cuộc sống.',
        price: 85000,
        originalPrice: 100000,
        images: [
            'https://picsum.photos/seed/book3/400/600',
            'https://picsum.photos/seed/book3b/400/600'
        ],
        categoryName: 'Kỹ năng sống',
        stock: 20, sold: 95, rating: 4.4, promotion: 15, isNew: false, isBestSeller: false, isFeatured: true
    },
    {
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        description: 'Cuốn sách tài chính cá nhân kinh điển về cách nghĩ và hành động của người giàu và người nghèo.',
        price: 150000,
        originalPrice: 180000,
        images: [
            'https://picsum.photos/seed/book4/400/600',
            'https://picsum.photos/seed/book4b/400/600'
        ],
        categoryName: 'Kinh tế',
        stock: 12, sold: 200, rating: 4.9, promotion: 17, isNew: false, isBestSeller: true, isFeatured: false
    },
    {
        title: 'Đắc nhân tâm',
        author: 'Dale Carnegie',
        description: 'Cuốn sách kinh điển về kỹ năng giao tiếp, xây dựng mối quan hệ và đạt được thành công trong cuộc sống.',
        price: 75000,
        originalPrice: 90000,
        images: [
            'https://picsum.photos/seed/book5/400/600',
            'https://picsum.photos/seed/book5b/400/600'
        ],
        categoryName: 'Kỹ năng sống',
        stock: 25, sold: 300, rating: 4.7, promotion: 17, isNew: false, isBestSeller: true, isFeatured: false
    },
    {
        title: 'Tuổi trẻ tráng lệ',
        author: 'Ngọc Ngọ',
        description: 'Tiểu thuyết tình cảm về tuổi trẻ, giấc mơ và những trải nghiệm đầu tiên trong cuộc sống.',
        price: 68000,
        originalPrice: 80000,
        images: [
            'https://picsum.photos/seed/book6/400/600',
            'https://picsum.photos/seed/book6b/400/600'
        ],
        categoryName: 'Văn học',
        stock: 18, sold: 65, rating: 4.3, promotion: 15, isNew: true, isBestSeller: false, isFeatured: false
    },
    {
        title: 'Sapiens: Lược sử loài người',
        author: 'Yuval Noah Harari',
        description: 'Cuốn sách khám phá lịch sử loài người từ thời tiền sử đến hiện đại.',
        price: 180000,
        originalPrice: 220000,
        images: [
            'https://picsum.photos/seed/book7/400/600',
            'https://picsum.photos/seed/book7b/400/600'
        ],
        categoryName: 'Văn học',
        stock: 5, sold: 45, rating: 4.8, promotion: 18, isNew: false, isBestSeller: false, isFeatured: true
    },
    {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        description: 'Cuốn sách khám phá hai hệ thống suy nghĩ của não người và cách chúng ảnh hưởng đến quyết định.',
        price: 200000,
        originalPrice: 250000,
        images: [
            'https://picsum.photos/seed/book8/400/600',
            'https://picsum.photos/seed/book8b/400/600'
        ],
        categoryName: 'Kinh tế',
        stock: 3, sold: 30, rating: 4.6, promotion: 20, isNew: true, isBestSeller: false, isFeatured: false
    }
];

const seedDB = async () => {
    try {
        await connectDB();

        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Old data cleared');

        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);

        const categoryMap = {};
        createdCategories.forEach(cat => { categoryMap[cat.name] = cat._id; });

        const productsWithCategory = products.map(p => ({
            ...p,
            category: categoryMap[p.categoryName]
        }));

        const createdProducts = await Product.insertMany(productsWithCategory);
        console.log(`Created ${createdProducts.length} products`);

        await mongoose.disconnect();
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedDB();