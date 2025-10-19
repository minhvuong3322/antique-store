/**
 * Fix social_auth table - Increase access_token column size
 * Run: node scripts/fix-social-auth-column.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixSocialAuthColumn() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'antique_store'
        });

        console.log('📦 Connected to database');

        // Check if social_auths table exists
        const [tables] = await connection.query(
            "SHOW TABLES LIKE 'social_auths'"
        );

        if (tables.length === 0) {
            console.log('❌ Table social_auths does not exist');
            return;
        }

        console.log('✅ Table social_auths found');

        // Get current column info
        const [columns] = await connection.query(
            "SHOW COLUMNS FROM social_auths WHERE Field = 'access_token'"
        );

        if (columns.length > 0) {
            console.log('📋 Current access_token column:', columns[0].Type);
        }

        // Alter column to TEXT
        await connection.query(`
            ALTER TABLE social_auths 
            MODIFY COLUMN access_token TEXT NULL
        `);

        console.log('✅ Column access_token updated to TEXT successfully!');

        // Verify change
        const [newColumns] = await connection.query(
            "SHOW COLUMNS FROM social_auths WHERE Field = 'access_token'"
        );

        console.log('📋 New access_token column:', newColumns[0].Type);

        // Also update refresh_token if exists
        const [refreshTokenColumn] = await connection.query(
            "SHOW COLUMNS FROM social_auths WHERE Field = 'refresh_token'"
        );

        if (refreshTokenColumn.length > 0) {
            await connection.query(`
                ALTER TABLE social_auths 
                MODIFY COLUMN refresh_token TEXT NULL
            `);
            console.log('✅ Column refresh_token updated to TEXT successfully!');
        }

        console.log('\n🎉 Database migration completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('📦 Database connection closed');
        }
    }
}

// Run migration
fixSocialAuthColumn();

