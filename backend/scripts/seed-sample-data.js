/**
 * Script to seed sample data for testing
 * Run: node scripts/seed-sample-data.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
    User,
    Category,
    Product,
    Supplier,
    ProductSupplier,
    Order,
    OrderDetail,
    Payment,
    Warranty,
    Invoice,
    WarehouseLog,
    CartItem,
    sequelize
} = require('../src/models');

const logger = require('../src/utils/logger');

// Sample data
const categories = [
    { name: 'Đồ sứ cổ', slug: 'do-su-co', description: 'Bộ sưu tập đồ sứ cổ quý hiếm' },
    { name: 'Đồng hồ cổ', slug: 'dong-ho-co', description: 'Đồng hồ cổ từ châu Âu' },
    { name: 'Tranh cổ', slug: 'tranh-co', description: 'Tranh vẽ cổ điển' },
    { name: 'Đồ gỗ cổ', slug: 'do-go-co', description: 'Đồ gỗ mỹ nghệ cổ' },
    { name: 'Đồ trang sức', slug: 'do-trang-suc', description: 'Trang sức cổ quý' }
];

const products = [
    {
        name: 'Lọ hoa sứ Minh Dynasty',
        slug: 'lo-hoa-su-minh',
        description: 'Lọ hoa sứ quý hiếm từ thời Minh, có niên đại 500 năm',
        price: 15000000,
        sale_price: 13500000,
        category_id: 1,
        sku: 'SU-001',
        stock_quantity: 3,
        images: JSON.stringify(['/images/su-minh-1.jpg', '/images/su-minh-2.jpg']),
        condition: 'good',
        year_manufactured: 1520,
        origin: 'Trung Quốc',
        material: 'Sứ cao cấp',
        dimensions: '30x30x45cm',
        is_featured: true,
        weight: 2.5
    },
    {
        name: 'Đồng hồ quả lắc Pháp',
        slug: 'dong-ho-qua-lac-phap',
        description: 'Đồng hồ quả lắc cổ điển từ Pháp, còn hoạt động tốt',
        price: 25000000,
        sale_price: 22000000,
        category_id: 2,
        sku: 'DH-001',
        stock_quantity: 2,
        images: JSON.stringify(['/images/dongho-1.jpg', '/images/dongho-2.jpg']),
        condition: 'good',
        year_manufactured: 1890,
        origin: 'Pháp',
        material: 'Gỗ sồi, đồng',
        dimensions: '40x20x60cm',
        is_featured: true,
        weight: 5.0
    },
    {
        name: 'Tranh sơn dầu châu Âu',
        slug: 'tranh-son-dau-chau-au',
        description: 'Bức tranh sơn dầu phong cảnh châu Âu, tác giả chưa rõ',
        price: 35000000,
        sale_price: null,
        category_id: 3,
        sku: 'TR-001',
        stock_quantity: 1,
        images: JSON.stringify(['/images/tranh-1.jpg']),
        condition: 'fair',
        year_manufactured: 1850,
        origin: 'Ý',
        material: 'Sơn dầu trên canvas',
        dimensions: '80x60cm',
        is_featured: true,
        weight: 3.0
    },
    {
        name: 'Tủ gỗ Huế cổ',
        slug: 'tu-go-hue-co',
        description: 'Tủ gỗ cổ Huế chạm khắc tinh xảo, còn nguyên vẹn',
        price: 45000000,
        sale_price: 42000000,
        category_id: 4,
        sku: 'GO-001',
        stock_quantity: 1,
        images: JSON.stringify(['/images/tu-go-1.jpg', '/images/tu-go-2.jpg', '/images/tu-go-3.jpg']),
        condition: 'good',
        year_manufactured: 1920,
        origin: 'Việt Nam',
        material: 'Gỗ lim',
        dimensions: '120x50x180cm',
        is_featured: false,
        weight: 80.0
    },
    {
        name: 'Vòng ngọc Phỉ Thúy',
        slug: 'vong-ngoc-phi-thuy',
        description: 'Vòng ngọc Phỉ Thúy cao cấp, màu xanh đậm',
        price: 12000000,
        sale_price: null,
        category_id: 5,
        sku: 'TS-001',
        stock_quantity: 5,
        images: JSON.stringify(['/images/vong-1.jpg']),
        condition: 'new',
        year_manufactured: 2000,
        origin: 'Myanmar',
        material: 'Ngọc Phỉ Thúy A',
        dimensions: 'Đường kính 6cm',
        is_featured: false,
        weight: 0.05
    },
    {
        name: 'Chén sứ Bát Tràng cổ',
        slug: 'chen-su-bat-trang-co',
        description: 'Chén sứ Bát Tràng thời Lê, có hoa văn rồng phượng',
        price: 8000000,
        sale_price: 7500000,
        category_id: 1,
        sku: 'SU-002',
        stock_quantity: 8,
        images: JSON.stringify(['/images/chen-1.jpg', '/images/chen-2.jpg']),
        condition: 'good',
        year_manufactured: 1700,
        origin: 'Việt Nam',
        material: 'Sứ Bát Tràng',
        dimensions: '12x12x7cm',
        is_featured: false,
        weight: 0.2
    },
    {
        name: 'Đồng hồ bỏ túi Thụy Sĩ',
        slug: 'dong-ho-bo-tui-thuy-si',
        description: 'Đồng hồ bỏ túi cổ của Thụy Sĩ, vỏ vàng 18K',
        price: 55000000,
        sale_price: 50000000,
        category_id: 2,
        sku: 'DH-002',
        stock_quantity: 1,
        images: JSON.stringify(['/images/dongho-tui-1.jpg']),
        condition: 'good',
        year_manufactured: 1910,
        origin: 'Thụy Sĩ',
        material: 'Vàng 18K',
        dimensions: 'Đường kính 5cm',
        is_featured: true,
        weight: 0.15
    },
    {
        name: 'Tranh thêu tay Huế',
        slug: 'tranh-theu-tay-hue',
        description: 'Tranh thêu tay phong cảnh Huế, công phu',
        price: 18000000,
        sale_price: null,
        category_id: 3,
        sku: 'TR-002',
        stock_quantity: 3,
        images: JSON.stringify(['/images/tranh-theu-1.jpg']),
        condition: 'new',
        year_manufactured: 1990,
        origin: 'Việt Nam',
        material: 'Lụa, chỉ tơ',
        dimensions: '60x40cm',
        is_featured: false,
        weight: 0.5
    },
    {
        name: 'Bàn ghế gỗ Hương',
        slug: 'ban-ghe-go-huong',
        description: 'Bộ bàn ghế gỗ Hương nguyên khối, 6 ghế',
        price: 95000000,
        sale_price: 88000000,
        category_id: 4,
        sku: 'GO-002',
        stock_quantity: 1,
        images: JSON.stringify(['/images/ban-ghe-1.jpg', '/images/ban-ghe-2.jpg']),
        condition: 'good',
        year_manufactured: 1950,
        origin: 'Việt Nam',
        material: 'Gỗ Hương',
        dimensions: 'Bàn 150x80x75cm',
        is_featured: true,
        weight: 150.0
    },
    {
        name: 'Nhẫn vàng cổ khắc chữ',
        slug: 'nhan-vang-co-khac-chu',
        description: 'Nhẫn vàng 24K cổ có khắc chữ Hán, nặng 10 chỉ',
        price: 28000000,
        sale_price: null,
        category_id: 5,
        sku: 'TS-002',
        stock_quantity: 2,
        images: JSON.stringify(['/images/nhan-1.jpg']),
        condition: 'good',
        year_manufactured: 1800,
        origin: 'Trung Quốc',
        material: 'Vàng 24K',
        dimensions: 'Size 16',
        is_featured: false,
        weight: 0.0375
    }
];

const suppliers = [
    {
        company_name: 'Antique Europe Imports',
        contact_person: 'Jean Pierre',
        email: 'contact@antiqueeurope.com',
        phone: '0901234567',
        address: '12 Rue de Rivoli, Paris, France',
        tax_code: 'FR123456789',
        description: 'Nhà cung cấp đồ cổ châu Âu cao cấp',
        is_active: true
    },
    {
        company_name: 'Đồ Cổ Á Đông',
        contact_person: 'Trần Văn An',
        email: 'contact@docoadong.vn',
        phone: '0912345678',
        address: '45 Nguyễn Huệ, Quận 1, TP.HCM',
        tax_code: '0123456789',
        description: 'Chuyên cung cấp đồ cổ Á Đông',
        is_active: true
    },
    {
        company_name: 'Heritage Antiques Ltd',
        contact_person: 'David Smith',
        email: 'info@heritage-antiques.com',
        phone: '0923456789',
        address: '88 Oxford Street, London, UK',
        tax_code: 'GB987654321',
        description: 'Đồ cổ Anh Quốc chính hãng',
        is_active: true
    }
];

const customers = [
    {
        email: 'nguyen.van.a@example.com',
        password: 'Customer@123',
        full_name: 'Nguyễn Văn A',
        phone: '0987654321',
        address: '123 Lê Lợi, Quận 1, TP.HCM',
        role: 'customer',
        is_active: true
    },
    {
        email: 'tran.thi.b@example.com',
        password: 'Customer@123',
        full_name: 'Trần Thị B',
        phone: '0976543210',
        address: '456 Nguyễn Trãi, Quận 5, TP.HCM',
        role: 'customer',
        is_active: true
    },
    {
        email: 'le.van.c@example.com',
        password: 'Customer@123',
        full_name: 'Lê Văn C',
        phone: '0965432109',
        address: '789 Võ Văn Tần, Quận 3, TP.HCM',
        role: 'customer',
        is_active: true
    },
    {
        email: 'pham.thi.d@example.com',
        password: 'Customer@123',
        full_name: 'Phạm Thị D',
        phone: '0954321098',
        address: '321 Hai Bà Trưng, Quận 1, TP.HCM',
        role: 'customer',
        is_active: true
    },
    {
        email: 'hoang.van.e@example.com',
        password: 'Customer@123',
        full_name: 'Hoàng Văn E',
        phone: '0943210987',
        address: '654 Điện Biên Phủ, Quận 3, TP.HCM',
        role: 'customer',
        is_active: true
    }
];

async function seedData() {
    const transaction = await sequelize.transaction();

    try {
        console.log('🌱 Starting data seeding...\n');

        // 1. Create Categories
        console.log('📁 Creating categories...');
        const createdCategories = await Category.bulkCreate(categories, { transaction });
        console.log(`✅ Created ${createdCategories.length} categories\n`);

        // 2. Create Products
        console.log('📦 Creating products...');
        const productsWithCategoryId = products.map((p, idx) => ({
            ...p,
            category_id: createdCategories[idx % createdCategories.length].id
        }));
        const createdProducts = await Product.bulkCreate(productsWithCategoryId, { transaction });
        console.log(`✅ Created ${createdProducts.length} products\n`);

        // 3. Create Suppliers
        console.log('🏭 Creating suppliers...');
        const createdSuppliers = await Supplier.bulkCreate(suppliers, { transaction });
        console.log(`✅ Created ${createdSuppliers.length} suppliers\n`);

        // 4. Link Products to Suppliers
        console.log('🔗 Linking products to suppliers...');
        const productSupplierLinks = [];
        createdProducts.forEach((product, idx) => {
            const supplier = createdSuppliers[idx % createdSuppliers.length];
            productSupplierLinks.push({
                product_id: product.id,
                supplier_id: supplier.id,
                supply_price: product.price * 0.7, // 70% of retail price
                is_primary: true
            });
        });
        await ProductSupplier.bulkCreate(productSupplierLinks, { transaction });
        console.log(`✅ Created ${productSupplierLinks.length} product-supplier links\n`);

        // 5. Create Warehouse Logs (Import)
        console.log('📊 Creating warehouse import logs...');
        const warehouseLogs = [];
        createdProducts.forEach((product, idx) => {
            const supplier = createdSuppliers[idx % createdSuppliers.length];
            warehouseLogs.push({
                product_id: product.id,
                supplier_id: supplier.id,
                type: 'import',
                quantity: product.stock_quantity,
                quantity_before: 0,
                quantity_after: product.stock_quantity,
                unit_price: product.price * 0.7,
                total_amount: product.price * 0.7 * product.stock_quantity,
                reference_type: 'purchase',
                notes: 'Initial stock import',
                created_by: 1 // Admin
            });
        });
        await WarehouseLog.bulkCreate(warehouseLogs, { transaction });
        console.log(`✅ Created ${warehouseLogs.length} warehouse logs\n`);

        // 6. Create Customers
        console.log('👥 Creating customers...');
        const hashedPassword = await bcrypt.hash('Customer@123', 10);
        const customersWithHashedPassword = customers.map(c => ({
            ...c,
            password: hashedPassword
        }));
        const createdCustomers = await User.bulkCreate(customersWithHashedPassword, { transaction });
        console.log(`✅ Created ${createdCustomers.length} customers\n`);

        // 7. Create Orders
        console.log('🛒 Creating orders...');
        const orders = [];
        const orderDetails = [];
        const payments = [];
        const warranties = [];

        // Create 15 sample orders
        for (let i = 0; i < 15; i++) {
            const customer = createdCustomers[i % createdCustomers.length];
            const orderProducts = [
                createdProducts[Math.floor(Math.random() * createdProducts.length)],
                createdProducts[Math.floor(Math.random() * createdProducts.length)]
            ];

            // Calculate totals
            let subtotal = 0;
            orderProducts.forEach(product => {
                const price = product.sale_price || product.price;
                subtotal += price * 1; // 1 quantity each
            });

            const shipping_fee = subtotal >= 10000000 ? 0 : 50000;
            const tax = subtotal * 0.1;
            const total_amount = subtotal + shipping_fee + tax;

            // Determine status based on order index
            let status = 'pending';
            if (i < 5) status = 'delivered';
            else if (i < 10) status = 'shipping';
            else if (i < 12) status = 'confirmed';

            const orderNumber = `ORD${String(i + 1).padStart(5, '0')}`;

            orders.push({
                user_id: customer.id,
                order_number: orderNumber,
                total_amount,
                shipping_address: customer.address,
                shipping_fee,
                tax,
                discount: 0,
                status,
                notes: i % 3 === 0 ? 'Giao hàng giờ hành chính' : null
            });
        }

        const createdOrders = await Order.bulkCreate(orders, { transaction });
        console.log(`✅ Created ${createdOrders.length} orders\n`);

        // 8. Create Order Details
        console.log('📝 Creating order details...');
        createdOrders.forEach((order, idx) => {
            const numProducts = Math.floor(Math.random() * 2) + 1; // 1-2 products per order
            for (let j = 0; j < numProducts; j++) {
                const product = createdProducts[(idx + j) % createdProducts.length];
                const price = product.sale_price || product.price;
                const quantity = 1;

                orderDetails.push({
                    order_id: order.id,
                    product_id: product.id,
                    quantity,
                    unit_price: price,
                    subtotal: price * quantity
                });
            }
        });

        const createdOrderDetails = await OrderDetail.bulkCreate(orderDetails, { transaction });
        console.log(`✅ Created ${createdOrderDetails.length} order details\n`);

        // 9. Create Payments
        console.log('💳 Creating payments...');
        createdOrders.forEach(order => {
            const payment_status = order.status === 'delivered' ? 'completed' :
                order.status === 'cancelled' ? 'failed' : 'pending';

            payments.push({
                order_id: order.id,
                amount: order.total_amount,
                payment_method: Math.random() > 0.5 ? 'COD' : 'VNPAY',
                payment_status,
                transaction_id: payment_status === 'completed' ? `TXN${Date.now()}${order.id}` : null
            });
        });

        await Payment.bulkCreate(payments, { transaction });
        console.log(`✅ Created ${payments.length} payments\n`);

        // 10. Create Warranties for delivered orders
        console.log('🛡️ Creating warranties...');
        const deliveredOrders = createdOrders.filter(o => o.status === 'delivered');

        for (const order of deliveredOrders) {
            const details = await OrderDetail.findAll({
                where: { order_id: order.id },
                transaction
            });

            for (const detail of details) {
                const warranty_period = 12; // 12 months
                const warranty_date = new Date();
                const expiry_date = new Date();
                expiry_date.setMonth(expiry_date.getMonth() + warranty_period);

                warranties.push({
                    order_id: order.id,
                    product_id: detail.product_id,
                    warranty_code: `WRT-${order.order_number}-P${detail.product_id}-${warranty_date.getFullYear()}${String(warranty_date.getMonth() + 1).padStart(2, '0')}${String(warranty_date.getDate()).padStart(2, '0')}`,
                    warranty_date,
                    expiry_date,
                    warranty_period,
                    status: 'active'
                });
            }
        }

        if (warranties.length > 0) {
            await Warranty.bulkCreate(warranties, { transaction });
            console.log(`✅ Created ${warranties.length} warranties\n`);
        }

        // 11. Create Invoices for delivered/shipping orders
        console.log('🧾 Creating invoices...');
        const invoices = [];
        const ordersForInvoice = createdOrders.filter(o =>
            o.status === 'delivered' || o.status === 'shipping'
        );

        for (const order of ordersForInvoice) {
            const customer = await User.findByPk(order.user_id, { transaction });
            const details = await OrderDetail.findAll({
                where: { order_id: order.id },
                transaction
            });

            const subtotal = details.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);

            const invoice_date = new Date(order.created_at);
            const invoice_number = `INV${invoice_date.getFullYear()}${String(invoice_date.getMonth() + 1).padStart(2, '0')}${String(order.id).padStart(4, '0')}`;

            invoices.push({
                order_id: order.id,
                invoice_number,
                invoice_date,
                customer_name: customer.full_name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                customer_address: order.shipping_address,
                subtotal,
                tax: order.tax,
                shipping_fee: order.shipping_fee,
                discount: order.discount,
                total_amount: order.total_amount,
                payment_method: 'COD',
                payment_status: order.status === 'delivered' ? 'paid' : 'unpaid',
                sent_to_email: order.status === 'delivered',
                created_by: 1 // Admin
            });
        }

        if (invoices.length > 0) {
            await Invoice.bulkCreate(invoices, { transaction });
            console.log(`✅ Created ${invoices.length} invoices\n`);
        }

        await transaction.commit();

        console.log('\n🎉 ========================================');
        console.log('🎉 DATA SEEDING COMPLETED SUCCESSFULLY!');
        console.log('🎉 ========================================\n');

        console.log('📊 Summary:');
        console.log(`   ✅ ${createdCategories.length} Categories`);
        console.log(`   ✅ ${createdProducts.length} Products`);
        console.log(`   ✅ ${createdSuppliers.length} Suppliers`);
        console.log(`   ✅ ${productSupplierLinks.length} Product-Supplier links`);
        console.log(`   ✅ ${warehouseLogs.length} Warehouse logs`);
        console.log(`   ✅ ${createdCustomers.length} Customers`);
        console.log(`   ✅ ${createdOrders.length} Orders`);
        console.log(`   ✅ ${createdOrderDetails.length} Order details`);
        console.log(`   ✅ ${payments.length} Payments`);
        console.log(`   ✅ ${warranties.length} Warranties`);
        console.log(`   ✅ ${invoices.length} Invoices`);

        console.log('\n🔑 Test Accounts:');
        console.log('   Admin: admin@antique.com / Admin@123');
        console.log('   Customer: nguyen.van.a@example.com / Customer@123');

        console.log('\n✨ You can now:');
        console.log('   1. Login to admin dashboard');
        console.log('   2. View all products, orders, customers');
        console.log('   3. Search and filter data');
        console.log('   4. Manage suppliers and warehouse');
        console.log('   5. Check warranties and invoices\n');

        process.exit(0);

    } catch (error) {
        await transaction.rollback();
        console.error('\n❌ Error seeding data:', error);
        logger.logError(error, { operation: 'seedData' });
        process.exit(1);
    }
}

// Run seeding
seedData();


