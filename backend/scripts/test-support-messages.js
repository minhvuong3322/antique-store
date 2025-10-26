/**
 * Test Support Messages Script
 * Kiểm tra xem có tin nhắn hỗ trợ nào trong database không
 */

const { sequelize } = require('../src/config/database');
const { SupportMessage, User } = require('../src/models');

async function testSupportMessages() {
    try {
        console.log('🔍 Đang kiểm tra support messages...\n');

        // Test 1: Đếm tổng số tin nhắn
        const totalMessages = await SupportMessage.count();
        console.log(`📊 Tổng số tin nhắn trong database: ${totalMessages}\n`);

        if (totalMessages === 0) {
            console.log('⚠️  Không có tin nhắn nào trong database!');
            console.log('💡 Hãy gửi tin nhắn từ trang Contact để test.\n');
            return;
        }

        // Test 2: Lấy tất cả tin nhắn với thông tin user
        const messages = await SupportMessage.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        console.log('📨 Danh sách tin nhắn:\n');
        messages.forEach((msg, index) => {
            console.log(`--- Tin nhắn ${index + 1} ---`);
            console.log(`ID: ${msg.id}`);
            console.log(`Subject: ${msg.subject}`);
            console.log(`Status: ${msg.status}`);
            console.log(`Priority: ${msg.priority}`);
            console.log(`From: ${msg.user ? msg.user.email : (msg.guest_email || 'Anonymous')}`);
            console.log(`Created: ${msg.created_at}`);
            console.log(`Has response: ${msg.admin_response ? 'Yes' : 'No'}`);
            console.log('');
        });

        // Test 3: Test như admin API
        console.log('\n🔧 Test Admin API Query:\n');
        const { count, rows } = await SupportMessage.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email', 'phone']
                }
            ]
        });

        console.log(`✅ API trả về: ${count} messages`);

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
        console.log('\n✨ Hoàn thành!');
    }
}

testSupportMessages();

