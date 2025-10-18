/**
 * Database Sync Script
 * Run this to create/update all tables in the database
 */

const { syncDatabase } = require('../src/models');
const { sequelize } = require('../src/config/database');

async function syncDb() {
    try {
        console.log('🔄 Starting database synchronization...\n');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.\n');

        // Sync all models
        console.log('📊 Syncing models...');
        await syncDatabase();

        console.log('\n✅ Database sync completed successfully!');
        console.log('\n📋 Tables updated/created:');
        console.log('   ✓ users (updated with supplier role)');
        console.log('   ✓ categories');
        console.log('   ✓ products');
        console.log('   ✓ cart_items');
        console.log('   ✓ orders');
        console.log('   ✓ order_details');
        console.log('   ✓ payments');
        console.log('   ✓ otps');
        console.log('   ✓ suppliers (NEW)');
        console.log('   ✓ product_suppliers (NEW)');
        console.log('   ✓ warehouse_logs (NEW)');
        console.log('   ✓ warranties (NEW)');
        console.log('   ✓ invoices (NEW)');

        console.log('\n🎉 Database is ready to use!');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database sync failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

syncDb();

