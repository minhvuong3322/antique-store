import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../LanguageSwitcher'
import Avatar from '../Avatar'
import {
    ShoppingCart,
    User,
    Menu,
    X,
    Sun,
    Moon,
    Search,
    LogOut
} from 'lucide-react'

const Navbar = () => {
    const { t, i18n } = useTranslation()
    const { isDark, toggleTheme } = useTheme()
    const { getCartItemsCount } = useCart()
    const { user, isAuthenticated, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const cartItemsCount = getCartItemsCount()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
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
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="text-3xl">🏺</div>
                        <div className="flex flex-col">
                            <span className="font-elegant text-xl text-vintage-darkwood dark:text-vintage-gold group-hover:text-vintage-bronze transition-colors">
                                Shop Đồ Cổ
                            </span>
                            <span className="text-xs text-vintage-gold font-serif italic">
                                Antique Store
                            </span>
                        </div>
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
                        {/* Search Icon */}
                        <button className="p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-vintage-darkwood dark:text-vintage-cream" />
                        </button>

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
                                <Avatar user={user} size="sm" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-3 py-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4 text-vintage-darkwood dark:text-vintage-cream" />
                                    <span className="text-sm text-vintage-darkwood dark:text-vintage-cream font-medium hidden md:block">
                                        Đăng xuất
                                    </span>
                                </button>
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


