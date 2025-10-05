import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import App from './App.jsx'
import './index.css'
import i18n from './i18n'

// Clear browser cache and storage in development
if (import.meta.env.DEV) {
    // Clear localStorage
    localStorage.clear()

    // Clear sessionStorage
    sessionStorage.clear()

    // Clear IndexedDB (if exists)
    if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
            databases.forEach(db => {
                indexedDB.deleteDatabase(db.name)
            })
        }).catch(console.log)
    }

    // Clear Service Worker cache
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister()
            })
        }).catch(console.log)
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </React.StrictMode>
)


