import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../LanguageSwitcher'
import Avatar from '../Avatar'
import Logo from '../Logo'
import {
    ShoppingCart,
    User,
    Menu,
    X,
    Sun,
    Moon,
    Search,
    LogOut,
    Shield,
    Package,
    Heart,
    MessageSquare
} from 'lucide-react'

const Navbar = () => {
    const { t, i18n } = useTranslation()
    const { isDark, toggleTheme } = useTheme()
    const { getCartItemsCount } = useCart()
    const { getWishlistCount } = useWishlist()
    const { user, isAuthenticated, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const cartItemsCount = getCartItemsCount()
    const wishlistCount = getWishlistCount()
    const dropdownRef = useRef(null)
    const searchRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Redirect to products page with search query
            window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
        }
    }

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
    }


    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/products', label: t('nav.products') },
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm border-b border-vintage-gold/20 shadow-vintage">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="group">
                        <Logo size="md" className="group-hover:opacity-80 transition-opacity" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors font-serif"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            {isSearchOpen ? (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark-card border border-vintage-gold/20 rounded-lg shadow-vintage p-4 z-50">
                                    <form onSubmit={handleSearch} className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Search className="w-4 h-4 text-vintage-gold" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={handleSearchKeyPress}
                                                placeholder="Tìm kiếm sản phẩm..."
                                                className="flex-1 bg-transparent border-none outline-none text-vintage-darkwood dark:text-vintage-cream placeholder-vintage-gold/60"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsSearchOpen(false)}
                                                className="px-3 py-1 text-sm text-vintage-gold hover:text-vintage-bronze transition-colors"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-1 bg-vintage-gold text-white text-sm rounded hover:bg-vintage-bronze transition-colors"
                                            >
                                                Tìm kiếm
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : null}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                                title="Tìm kiếm sản phẩm"
                                aria-label="Mở tìm kiếm"
                                role="button"
                                tabIndex={0}
                            >
                                <Search className="w-5 h-5 text-vintage-darkwood dark:text-vintage-cream" />
                            </button>
                        </div>

                        {/* Language Toggle */}
                        <LanguageSwitcher />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                            title={isDark ? t('common.light_mode') : t('common.dark_mode')}
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-vintage-gold" />
                            ) : (
                                <Moon className="w-5 h-5 text-vintage-darkwood" />
                            )}
                        </button>

                        {/* User Account / Login / Logout */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2">
                                {/* User Avatar with Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        onMouseEnter={() => setIsUserMenuOpen(true)}
                                        className="cursor-pointer p-1 rounded-full hover:bg-vintage-gold/10 transition-colors"
                                    >
                                        <Avatar user={user} size="sm" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card border border-vintage-gold/20 rounded-lg shadow-vintage py-2 z-50"
                                            onMouseEnter={() => setIsUserMenuOpen(true)}
                                            onMouseLeave={() => setIsUserMenuOpen(false)}
                                        >
                                            <div className="px-4 py-2 border-b border-vintage-gold/20">
                                                <div className="text-sm font-medium text-vintage-darkwood dark:text-vintage-cream">
                                                    {user?.full_name || user?.email}
                                                </div>
                                                <div className="text-xs text-vintage-gold">
                                                    {user?.email}
                                                </div>
                                            </div>

                                            {/* Wishlist Menu Item */}
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-3 hover:bg-vintage-gold/10 transition-colors"
                                            >
                                                <Heart className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-vintage-darkwood dark:text-vintage-cream">
                                                    Yêu thích
                                                </span>
                                                {wishlistCount > 0 && (
                                                    <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {wishlistCount}
                                                    </div>
                                                )}
                                            </Link>

                                            {/* My Orders Menu Item */}
                                            <Link
                                                to="/my-orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-3 hover:bg-vintage-gold/10 transition-colors"
                                            >
                                                <Package className="w-4 h-4 text-vintage-bronze dark:text-vintage-gold" />
                                                <span className="text-sm text-vintage-darkwood dark:text-vintage-cream">
                                                    Đơn hàng của tôi
                                                </span>
                                            </Link>

                                            {/* Admin Panel - Show for admin and staff users */}
                                            {(user?.role === 'admin' || user?.role === 'staff') && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-vintage-gold/10 transition-colors"
                                                >
                                                    <Shield className="w-4 h-4 text-vintage-bronze dark:text-vintage-gold" />
                                                    <span className="text-sm text-vintage-darkwood dark:text-vintage-cream">
                                                        {user?.role === 'admin' ? 'Admin Panel' : 'Quản lý'}
                                                    </span>
                                                </Link>
                                            )}

                                            <div className="border-t border-vintage-gold/20 mt-2 pt-2">
                                                <button
                                                    onClick={() => {
                                                        handleLogout()
                                                        setIsUserMenuOpen(false)
                                                    }}
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-vintage-gold/10 transition-colors w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4 text-vintage-darkwood dark:text-vintage-cream" />
                                                    <span className="text-sm text-vintage-darkwood dark:text-vintage-cream">
                                                        Đăng xuất
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors hidden sm:block"
                                title="Đăng nhập"
                            >
                                <User className="w-5 h-5 text-vintage-darkwood dark:text-vintage-cream" />
                            </Link>
                        )}

                        {/* Shopping Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 text-vintage-darkwood dark:text-vintage-cream" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-vintage-bronze text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-vintage-darkwood dark:text-vintage-cream" />
                            ) : (
                                <Menu className="w-6 h-6 text-vintage-darkwood dark:text-vintage-cream" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-vintage-gold/20">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors font-serif px-2 py-1"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <div className="px-2 py-1 border-t border-vintage-gold/20 pt-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Avatar user={user} size="md" />
                                        <div>
                                            <div className="text-sm font-medium text-vintage-darkwood dark:text-vintage-cream">
                                                {user?.full_name || user?.email}
                                            </div>
                                            <div className="text-xs text-vintage-gold">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Wishlist Button for Mobile */}
                                    <Link
                                        to="/wishlist"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-red-500 hover:text-red-600 transition-colors font-serif flex items-center space-x-2 px-3 py-2 hover:bg-vintage-gold/10 rounded-lg mb-2"
                                    >
                                        <Heart className="w-4 h-4" />
                                        <span>Yêu thích</span>
                                        {wishlistCount > 0 && (
                                            <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {wishlistCount}
                                            </div>
                                        )}
                                    </Link>
                                    {/* My Orders Button for Mobile */}
                                    <Link
                                        to="/my-orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-vintage-bronze dark:text-vintage-gold hover:text-vintage-gold transition-colors font-serif flex items-center space-x-2 px-3 py-2 hover:bg-vintage-gold/10 rounded-lg mb-2"
                                    >
                                        <Package className="w-4 h-4" />
                                        <span>Đơn hàng của tôi</span>
                                    </Link>
                                    {/* Admin Panel Button for Mobile - Show for admin and staff users */}
                                    {(user?.role === 'admin' || user?.role === 'staff') && (
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-vintage-bronze dark:text-vintage-gold hover:text-vintage-gold transition-colors font-serif flex items-center space-x-2 px-3 py-2 bg-vintage-gold/20 rounded-lg mb-2"
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span>{user?.role === 'admin' ? 'Admin Panel - Quản lý' : 'Quản lý'}</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMenuOpen(false)
                                        }}
                                        className="w-full text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors font-serif flex items-center space-x-2 px-3 py-2 bg-vintage-gold/10 rounded-lg"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors font-serif px-2 py-1 flex items-center space-x-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar


