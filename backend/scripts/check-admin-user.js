/**
 * Check Admin User Script
 * Kiểm tra user hiện tại và role của họ
 */

const { sequelize } = require('../src/config/database');
const { User } = require('../src/models');

async function checkAdminUsers() {
    try {
        console.log('🔍 Đang kiểm tra users...\n');

        // Lấy tất cả admins
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id', 'full_name', 'email', 'role', 'is_active']
        });

        console.log('👑 Admin users:\n');
        if (admins.length === 0) {
            console.log('⚠️  Không có admin nào trong database!');
        } else {
            admins.forEach((admin, index) => {
                console.log(`--- Admin ${index + 1} ---`);
                console.log(`ID: ${admin.id}`);
                console.log(`Name: ${admin.full_name}`);
                console.log(`Email: ${admin.email}`);
                console.log(`Role: ${admin.role}`);
                console.log(`Active: ${admin.is_active ? '✅' : '❌'}`);
                console.log('');
            });
        }

        // Lấy tất cả users
        const allUsers = await User.findAll({
            attributes: ['id', 'full_name', 'email', 'role', 'is_active']
        });

        console.log('\n📊 Tất cả users:\n');
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} - Role: ${user.role} - Active: ${user.is_active ? '✅' : '❌'}`);
        });

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
        console.log('\n✨ Hoàn thành!');
    }
}

checkAdminUsers();

