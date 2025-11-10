/**
 * Migration script to add conversation support to support_messages
 * Adds parent_id, conversation_id, and sender_type columns to allow replies
 */

const { sequelize } = require('../src/config/database');

async function checkColumnExists(tableName, columnName) {
    const [results] = await sequelize.query(`
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = '${tableName}'
        AND COLUMN_NAME = '${columnName}'
    `);
    return results[0].count > 0;
}

async function checkIndexExists(tableName, indexName) {
    const [results] = await sequelize.query(`
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = '${tableName}'
        AND INDEX_NAME = '${indexName}'
    `);
    return results[0].count > 0;
}

async function addConversationSupport() {
    try {
        console.log('🔄 Adding conversation support to support_messages...');
        
        // Check and add parent_id column
        const hasParentId = await checkColumnExists('support_messages', 'parent_id');
        if (!hasParentId) {
            console.log('  ➕ Adding parent_id column...');
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD COLUMN parent_id INT NULL
            `);
        } else {
            console.log('  ✓ parent_id column already exists');
        }
        
        // Check and add conversation_id column
        const hasConversationId = await checkColumnExists('support_messages', 'conversation_id');
        if (!hasConversationId) {
            console.log('  ➕ Adding conversation_id column...');
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD COLUMN conversation_id INT NULL
            `);
        } else {
            console.log('  ✓ conversation_id column already exists');
        }
        
        // Check and add sender_type column
        const hasSenderType = await checkColumnExists('support_messages', 'sender_type');
        if (!hasSenderType) {
            console.log('  ➕ Adding sender_type column...');
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD COLUMN sender_type ENUM('customer', 'admin', 'staff') NULL
            `);
        } else {
            console.log('  ✓ sender_type column already exists');
        }
        
        // Check and add indexes
        const hasParentIdIndex = await checkIndexExists('support_messages', 'idx_parent_id');
        if (!hasParentIdIndex) {
            console.log('  ➕ Adding idx_parent_id index...');
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD INDEX idx_parent_id (parent_id)
            `);
        } else {
            console.log('  ✓ idx_parent_id index already exists');
        }
        
        const hasConversationIdIndex = await checkIndexExists('support_messages', 'idx_conversation_id');
        if (!hasConversationIdIndex) {
            console.log('  ➕ Adding idx_conversation_id index...');
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD INDEX idx_conversation_id (conversation_id)
            `);
        } else {
            console.log('  ✓ idx_conversation_id index already exists');
        }
        
        // Check and add foreign keys (only if columns exist and foreign keys don't)
        try {
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD CONSTRAINT fk_parent_id 
                FOREIGN KEY (parent_id) REFERENCES support_messages(id) ON DELETE CASCADE
            `);
            console.log('  ➕ Added parent_id foreign key');
        } catch (error) {
            if (error.original?.code === 'ER_DUP_KEY' || error.original?.code === 'ER_FK_DUP_NAME') {
                console.log('  ✓ parent_id foreign key already exists');
            } else {
                throw error;
            }
        }
        
        try {
            await sequelize.query(`
                ALTER TABLE support_messages 
                ADD CONSTRAINT fk_conversation_id 
                FOREIGN KEY (conversation_id) REFERENCES support_messages(id) ON DELETE CASCADE
            `);
            console.log('  ➕ Added conversation_id foreign key');
        } catch (error) {
            if (error.original?.code === 'ER_DUP_KEY' || error.original?.code === 'ER_FK_DUP_NAME') {
                console.log('  ✓ conversation_id foreign key already exists');
            } else {
                throw error;
            }
        }
        
        // Set conversation_id for existing messages (each message is its own conversation)
        console.log('  🔄 Updating existing messages...');
        await sequelize.query(`
            UPDATE support_messages 
            SET conversation_id = id 
            WHERE conversation_id IS NULL
        `);
        
        // Set sender_type for existing messages
        await sequelize.query(`
            UPDATE support_messages 
            SET sender_type = 'customer'
            WHERE sender_type IS NULL AND user_id IS NOT NULL
        `);
        
        await sequelize.query(`
            UPDATE support_messages 
            SET sender_type = 'customer'
            WHERE sender_type IS NULL AND user_id IS NULL
        `);
        
        console.log('✅ Conversation support added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding conversation support:', error);
        process.exit(1);
    }
}

addConversationSupport();

