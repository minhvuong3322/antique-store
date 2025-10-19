/**
 * Quick seed script - Add minimal data for testing
 * Run: node scripts/quick-seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
    User,
    Product,
    Order,
    OrderDetail,
    Payment,
    sequelize
} = require('../src/models');

async function quickSeed() {
    try {
        console.log('🌱 Quick seeding...\n');

        // 1. Check if we have categories
        const categoryCount = await sequelize.query('SELECT COUNT(*) as count FROM categories', {
            type: sequelize.QueryTypes.SELECT
        });

        if (categoryCount[0].count === 0) {
            console.log('❌ No categories found. Please create categories first.');
            process.exit(1);
        }

        // 2. Create a few products if none exist
        const productCount = await Product.count();
        if (productCount === 0) {
            console.log('📦 Creating sample products...');
            await Product.bulkCreate([
                {
                    name: 'Lọ hoa sứ cổ',
                    slug: 'lo-hoa-su-co',
                    description: 'Lọ hoa sứ quý hiếm từ thời xưa',
                    price: 5000000,
                    sale_price: 4500000,
                    category_id: 1,
                    sku: 'TEST-001',
                    stock_quantity: 10,
                    images: JSON.stringify(['/images/vase1.jpg']),
                    condition: 'good',
                    year_manufactured: 1900,
                    origin: 'Việt Nam',
                    material: 'Sứ',
                    is_featured: true
                },
                {
                    name: 'Đồng hồ cổ',
                    slug: 'dong-ho-co',
                    description: 'Đồng hồ quả lắc cổ điển',
                    price: 8000000,
                    sale_price: 7000000,
                    category_id: 1,
                    sku: 'TEST-002',
                    stock_quantity: 5,
                    images: JSON.stringify(['/images/clock1.jpg']),
                    condition: 'good',
                    year_manufactured: 1920,
                    origin: 'Pháp',
                    material: 'Gỗ',
                    is_featured: true
                }
            ]);
            console.log('✅ Created 2 products\n');
        } else {
            console.log(`✅ Already have ${productCount} products\n`);
        }

        // 3. Create a test customer if needed
        let customer = await User.findOne({ where: { email: 'test@customer.com' } });
        if (!customer) {
            console.log('👤 Creating test customer...');
            const hashedPassword = await bcrypt.hash('Customer@123', 10);
            customer = await User.create({
                email: 'test@customer.com',
                password: hashedPassword,
                full_name: 'Khách Hàng Test',
                phone: '0987654321',
                address: '123 Test St, HCMC',
                role: 'customer'
            });
            console.log('✅ Created test customer\n');
        } else {
            console.log('✅ Test customer already exists\n');
        }

        // 4. Create a few orders
        const orderCount = await Order.count();
        if (orderCount < 3) {
            console.log('🛒 Creating sample orders...');

            const products = await Product.findAll({ limit: 2 });

            for (let i = 0; i < 3; i++) {
                const product = products[i % products.length];
                const price = product.sale_price || product.price;
                const subtotal = price;
                const shipping_fee = 50000;
                const tax = subtotal * 0.1;
                const total_amount = subtotal + shipping_fee + tax;

                const order = await Order.create({
                    user_id: customer.id,
                    order_number: `ORD${Date.now()}${i}`,
                    total_amount,
                    shipping_address: customer.address,
                    shipping_fee,
                    tax,
                    discount: 0,
                    status: i === 0 ? 'delivered' : 'pending'
                });

                await OrderDetail.create({
                    order_id: order.id,
                    product_id: product.id,
                    quantity: 1,
                    unit_price: price,
                    subtotal
                });

                await Payment.create({
                    order_id: order.id,
                    amount: total_amount,
                    payment_method: 'COD',
                    payment_status: i === 0 ? 'completed' : 'pending'
                });
            }

            console.log('✅ Created 3 orders\n');
        } else {
            console.log(`✅ Already have ${orderCount} orders\n`);
        }

        console.log('\n🎉 Quick seed completed!');
        console.log('\n📊 Current Data:');
        console.log(`   Products: ${await Product.count()}`);
        console.log(`   Orders: ${await Order.count()}`);
        console.log(`   Customers: ${await User.count({ where: { role: 'customer' } })}`);

        console.log('\n✅ Now refresh the admin dashboard!');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

quickSeed();


