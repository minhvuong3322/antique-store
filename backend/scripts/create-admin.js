/**
 * Create Admin User Script
 * Run this to create an admin account for testing
 */

const bcrypt = require('bcryptjs');
const { User } = require('../src/models');

async function createAdmin() {
    try {
        console.log('👤 Creating admin user...\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            where: { email: 'admin@antiquestore.com' }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@antiquestore.com');
            console.log('👤 Name:', existingAdmin.full_name);
            console.log('🔑 Role:', existingAdmin.role);
            console.log('\nIf you need to reset password, please update directly in database.');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        // Create admin user
        const admin = await User.create({
            email: 'admin@antiquestore.com',
            password: hashedPassword,
            full_name: 'Administrator',
            phone: '0123456789',
            address: 'Antique Store HQ',
            role: 'admin',
            is_active: true
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('📋 Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    admin@antiquestore.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 Name:     Administrator');
        console.log('🎭 Role:     admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('⚠️  IMPORTANT: Change this password after first login!\n');
        console.log('🚀 You can now login at: http://localhost:5173/login');
        console.log('📍 Admin Dashboard: http://localhost:5173/admin/dashboard\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create admin user:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createAdmin();

