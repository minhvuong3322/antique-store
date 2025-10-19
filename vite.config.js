import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '')

    // Cấu hình HTTPS cho development
    const httpsConfig = env.VITE_ENABLE_HTTPS === 'true' ? {
        https: {
            key: fs.existsSync('./backend/certs/localhost.key')
                ? fs.readFileSync('./backend/certs/localhost.key')
                : undefined,
            cert: fs.existsSync('./backend/certs/localhost.crt')
                ? fs.readFileSync('./backend/certs/localhost.crt')
                : undefined,
        }
    } : {}

    return {
        plugins: [react()],
        server: {
            // Disable cache in development
            force: true,
            port: 5173,
            // HTTPS configuration (nếu enable)
            ...httpsConfig,
            // Add cache busting headers
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            // Proxy configuration (optional - nếu muốn proxy qua Vite)
            proxy: env.VITE_USE_PROXY === 'true' ? {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false, // Cho phép self-signed certificates
                    // rewrite: (path) => path.replace(/^\/api/, '')
                }
            } : undefined
        },
        build: {
            // Clear cache before build
            emptyOutDir: true,
            // Add hash to filenames for cache busting
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[name]-[hash].js',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]'
                }
            }
        },
        // Force reload on file changes
        optimizeDeps: {
            force: true
        }
    }
})

