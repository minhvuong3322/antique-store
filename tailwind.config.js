/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Vintage Antique Color Palette
                vintage: {
                    gold: '#D4A574',
                    bronze: '#CD7F32',
                    darkwood: '#3E2723',
                    wood: '#5D4037',
                    lightwood: '#8D6E63',
                    cream: '#F5E6D3',
                    ivory: '#FFFFF0',
                    sage: '#9CAF88',
                    rust: '#B7410E',
                },
                // Dark mode colors
                dark: {
                    bg: '#1A1410',
                    card: '#2D2419',
                    border: '#3E342A',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Cormorant Garamond', 'ui-sans-serif', 'system-ui'],
                elegant: ['Cinzel', 'serif'],
            },
            boxShadow: {
                'vintage': '0 4px 6px -1px rgba(212, 165, 116, 0.1), 0 2px 4px -1px rgba(212, 165, 116, 0.06)',
                'vintage-lg': '0 10px 15px -3px rgba(212, 165, 116, 0.2), 0 4px 6px -2px rgba(212, 165, 116, 0.1)',
            },
        },
    },
    plugins: [],
}


