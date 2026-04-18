import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import i18n from './i18n'

// Debug: Check if env variable is loaded
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('🔑 VITE_GOOGLE_CLIENT_ID:', clientId);
console.log('📝 All ENV vars:', import.meta.env);

// Validate Client ID
if (!clientId || clientId === 'undefined') {
    console.error('❌ VITE_GOOGLE_CLIENT_ID is not defined! Please check your .env file');
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider
            clientId={clientId}
            onScriptLoadSuccess={() => console.log('✅ Google OAuth script loaded successfully')}
            onScriptLoadError={() => console.error('❌ Failed to load Google OAuth script')}
        >
            <I18nextProvider i18n={i18n}>
                <App />
            </I18nextProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)