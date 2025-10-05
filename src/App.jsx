import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyOTPPage from './pages/VerifyOTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TestAPI from './components/TestAPI'

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                            }}
                        />
                        <Router>
                            <Layout>
                                <Routes>
                                    {/* Public routes */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/products" element={<ProductsPage />} />
                                    <Route path="/products/:id" element={<ProductDetailPage />} />
                                    <Route path="/about" element={<AboutPage />} />
                                    <Route path="/contact" element={<ContactPage />} />

                                    {/* Auth routes - redirect if already logged in */}
                                    <Route path="/login" element={
                                        <ProtectedRoute requireAuth={false}>
                                            <LoginPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/register" element={
                                        <ProtectedRoute requireAuth={false}>
                                            <RegisterPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/forgot-password" element={
                                        <ProtectedRoute requireAuth={false}>
                                            <ForgotPasswordPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/verify-otp" element={
                                        <ProtectedRoute requireAuth={false}>
                                            <VerifyOTPPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/reset-password" element={
                                        <ProtectedRoute requireAuth={false}>
                                            <ResetPasswordPage />
                                        </ProtectedRoute>
                                    } />

                                    {/* Protected routes - require authentication */}
                                    <Route path="/cart" element={
                                        <ProtectedRoute requireAuth={true}>
                                            <CartPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/checkout" element={
                                        <ProtectedRoute requireAuth={true}>
                                            <CheckoutPage />
                                        </ProtectedRoute>
                                    } />

                                    {/* Test route */}
                                    <Route path="/test-api" element={<TestAPI />} />
                                </Routes>
                            </Layout>
                        </Router>
                    </WishlistProvider>
                </CartProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App


