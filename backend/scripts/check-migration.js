#!/usr/bin/env node

/**
 * Migration Helper Script
 * Checks for console.error usage and provides migration suggestions
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
};

const log = {
    success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
    error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
    warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
    info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
    title: (msg) => console.log(`\n${COLORS.magenta}${msg}${COLORS.reset}\n`),
};

// Directories to scan
const SCAN_DIRS = [
    path.join(__dirname, '../src/controllers'),
    path.join(__dirname, '../src/routes'),
    path.join(__dirname, '../src/models'),
    path.join(__dirname, '../src/middlewares'),
];

// Files to exclude
const EXCLUDE_FILES = [
    'logger.js',
    'errorHandler.js',
];

// Patterns to check
const PATTERNS = {
    consoleError: /console\.error/g,
    consoleLog: /console\.log/g,
    tryCatch: /try\s*{[\s\S]*?}\s*catch/g,
    asyncFunction: /async\s+(function|\([\s\S]*?\)\s*=>)/g,
};

let issues = {
    consoleError: [],
    consoleLog: [],
    tryCatch: [],
    asyncWithoutHandler: [],
};

/**
 * Scan a file for migration issues
 */
function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    const lines = content.split('\n');

    // Check for console.error
    let match;
    while ((match = PATTERNS.consoleError.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1].trim();
        issues.consoleError.push({
            file: relativePath,
            line: lineNumber,
            content: lineContent,
        });
    }

    // Check for console.log in production code
    PATTERNS.consoleLog.lastIndex = 0;
    while ((match = PATTERNS.consoleLog.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1].trim();

        // Only flag if not in comments
        if (!lineContent.startsWith('//') && !lineContent.startsWith('*')) {
            issues.consoleLog.push({
                file: relativePath,
                line: lineNumber,
                content: lineContent,
            });
        }
    }

    // Check for try-catch blocks (suggest asyncHandler)
    PATTERNS.tryCatch.lastIndex = 0;
    while ((match = PATTERNS.tryCatch.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        issues.tryCatch.push({
            file: relativePath,
            line: lineNumber,
        });
    }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            if (!EXCLUDE_FILES.includes(entry.name)) {
                scanFile(fullPath);
            }
        }
    }
}

/**
 * Display results
 */
function displayResults() {
    log.title('🔍 Migration Check Results');

    let totalIssues = 0;

    // Console.error issues
    if (issues.consoleError.length > 0) {
        log.error(`Found ${issues.consoleError.length} console.error usage(s)`);
        console.log('\n  Replace with logger.error() or logger.logError():\n');
        issues.consoleError.forEach((issue, index) => {
            console.log(`  ${index + 1}. ${issue.file}:${issue.line}`);
            console.log(`     ${COLORS.red}${issue.content}${COLORS.reset}`);
            console.log(`     ${COLORS.green}logger.logError(error, { context: 'operation' });${COLORS.reset}\n`);
        });
        totalIssues += issues.consoleError.length;
    } else {
        log.success('No console.error usage found');
    }

    // Console.log issues
    if (issues.consoleLog.length > 0) {
        log.warning(`Found ${issues.consoleLog.length} console.log usage(s)`);
        console.log('\n  Consider replacing with logger.info(), logger.debug(), or logger.warn():\n');
        issues.consoleLog.slice(0, 5).forEach((issue, index) => {
            console.log(`  ${index + 1}. ${issue.file}:${issue.line}`);
            console.log(`     ${issue.content}\n`);
        });
        if (issues.consoleLog.length > 5) {
            console.log(`  ... and ${issues.consoleLog.length - 5} more\n`);
        }
    } else {
        log.success('No console.log usage found');
    }

    // Try-catch blocks
    if (issues.tryCatch.length > 0) {
        log.warning(`Found ${issues.tryCatch.length} try-catch block(s)`);
        console.log('\n  Consider using asyncHandler to eliminate try-catch:\n');
        console.log(`  ${COLORS.yellow}Before:${COLORS.reset}`);
        console.log(`  router.get('/', async (req, res, next) => {`);
        console.log(`    try { ... } catch (error) { next(error); }`);
        console.log(`  });\n`);
        console.log(`  ${COLORS.green}After:${COLORS.reset}`);
        console.log(`  router.get('/', asyncHandler(async (req, res) => {`);
        console.log(`    // No try-catch needed`);
        console.log(`  }));\n`);
    } else {
        log.success('No try-catch blocks found');
    }

    // Summary
    log.title('📊 Summary');
    if (totalIssues === 0) {
        log.success('Migration complete! No issues found. 🎉');
    } else {
        log.warning(`Found ${totalIssues} critical issue(s) that need attention.`);
        console.log('\nRecommended actions:');
        console.log('1. Replace console.error with logger.logError()');
        console.log('2. Replace console.log with appropriate logger methods');
        console.log('3. Consider using asyncHandler for async routes\n');
        console.log('See ERROR_HANDLING_GUIDE.md for detailed instructions.\n');
    }
}

/**
 * Check if required files exist
 */
function checkSetup() {
    log.title('📦 Checking Setup');

    const requiredFiles = [
        { path: 'src/utils/logger.js', name: 'Logger utility' },
        { path: 'src/middlewares/errorHandler.js', name: 'Error handler' },
        { path: 'logs', name: 'Logs directory', isDir: true },
        { path: '.env', name: 'Environment file' },
    ];

    let setupComplete = true;

    for (const file of requiredFiles) {
        const fullPath = path.join(__dirname, '..', file.path);
        const exists = fs.existsSync(fullPath);

        if (exists) {
            log.success(`${file.name} exists`);
        } else {
            log.error(`${file.name} missing: ${file.path}`);
            setupComplete = false;
        }
    }

    // Check dependencies
    const packageJson = require('../package.json');
    const requiredDeps = ['winston', '@sentry/node'];

    for (const dep of requiredDeps) {
        if (packageJson.dependencies[dep]) {
            log.success(`${dep} installed`);
        } else {
            log.error(`${dep} not installed - run: npm install ${dep}`);
            setupComplete = false;
        }
    }

    if (!setupComplete) {
        console.log('\n❌ Setup incomplete. Please install missing dependencies and files.\n');
        process.exit(1);
    }

    log.success('Setup complete!\n');
}

// Main execution
function main() {
    console.log('\n' + '='.repeat(60));
    console.log('  Migration Helper - Error Handling & Logging Upgrade');
    console.log('='.repeat(60) + '\n');

    // Check setup
    checkSetup();

    // Scan directories
    log.info('Scanning codebase...\n');
    for (const dir of SCAN_DIRS) {
        scanDirectory(dir);
    }

    // Display results
    displayResults();
}

main();

