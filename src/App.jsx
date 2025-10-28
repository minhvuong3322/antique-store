import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyOTPPage from './pages/VerifyOTPPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyOrders from './pages/MyOrders'
import MySupport from './pages/MySupport'
import OrderDetail from './pages/OrderDetail'
// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'
import Support from './pages/admin/Support'
import Analytics from './pages/admin/Analytics'
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
                        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <Routes>
                                {/* Public routes with main layout */}
                                <Route path="/" element={<Layout><HomePage /></Layout>} />
                                <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
                                <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
                                <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                                <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
                                <Route path="/test-api" element={<Layout><TestAPI /></Layout>} />

                                {/* Auth routes - redirect if already logged in */}
                                <Route path="/login" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={false}>
                                            <LoginPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/register" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={false}>
                                            <RegisterPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/forgot-password" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={false}>
                                            <ForgotPasswordPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/verify-otp" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={false}>
                                            <VerifyOTPPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/reset-password" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={false}>
                                            <ResetPasswordPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />

                                {/* Protected routes - require authentication */}
                                <Route path="/cart" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <CartPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/wishlist" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <WishlistPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/checkout" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <CheckoutPage />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/my-orders" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <MyOrders />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/my-support" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <MySupport />
                                        </ProtectedRoute>
                                    </Layout>
                                } />
                                <Route path="/orders/:id" element={
                                    <Layout>
                                        <ProtectedRoute requireAuth={true}>
                                            <OrderDetail />
                                        </ProtectedRoute>
                                    </Layout>
                                } />

                                {/* Admin Routes - Separate Layout */}
                                <Route path="/admin" element={
                                    <ProtectedRoute requireAuth={true} requireRole={['admin', 'staff']}>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }>
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="orders" element={<Orders />} />
                                    <Route path="users" element={<Users />} />
                                    <Route path="support" element={<Support />} />
                                    <Route path="analytics" element={<Analytics />} />
                                </Route>
                            </Routes>
                        </Router>
                    </WishlistProvider>
                </CartProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App


