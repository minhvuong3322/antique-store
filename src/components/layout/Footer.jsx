import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react'

const Footer = () => {
    const { t } = useTranslation()

    const quickLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/products', label: t('nav.products') },
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
    ]

    const categories = [
        'Gốm Sứ',
        'Đồ Gỗ',
        'Đồng Hồ',
        'Đèn Cổ',
        'Tranh',
        'Đồ Bạc'
    ]

    return (
        <footer className="bg-vintage-darkwood dark:bg-dark-bg text-vintage-cream border-t border-vintage-gold/20">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-3xl">🏺</div>
                            <div>
                                <h3 className="font-elegant text-xl text-vintage-gold">
                                    Shop Đồ Cổ
                                </h3>
                                <p className="text-xs italic">Antique Store</p>
                            </div>
                        </div>
                        <p className="text-sm text-vintage-cream/80">
                            {t('footer.description')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-vintage-gold transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-vintage-gold transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-vintage-gold transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg text-vintage-gold mb-4">
                            {t('footer.quick_links')}
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-vintage-cream/80 hover:text-vintage-gold transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-serif text-lg text-vintage-gold mb-4">
                            {t('footer.categories')}
                        </h4>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/products?category=${category}`}
                                        className="text-sm text-vintage-cream/80 hover:text-vintage-gold transition-colors"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif text-lg text-vintage-gold mb-4">
                            {t('footer.contact_info')}
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2 text-sm text-vintage-cream/80">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-vintage-gold" />
                                <span>123 Phố Cổ, Quận Hoàn Kiếm, Hà Nội</span>
                            </li>
                            <li className="flex items-center space-x-2 text-sm text-vintage-cream/80">
                                <Phone className="w-4 h-4 flex-shrink-0 text-vintage-gold" />
                                <span>0928 172 081</span>
                            </li>
                            <li className="flex items-center space-x-2 text-sm text-vintage-cream/80">
                                <Mail className="w-4 h-4 flex-shrink-0 text-vintage-gold" />
                                <span>contact@shopdoco.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-8 border-t border-vintage-gold/20">
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="font-serif text-lg text-vintage-gold mb-2">
                            {t('footer.newsletter')}
                        </h4>
                        <p className="text-sm text-vintage-cream/80 mb-4">
                            {t('footer.newsletter_text')}
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email của bạn..."
                                className="flex-1 px-4 py-2 bg-vintage-cream/10 border border-vintage-gold/30 rounded-md text-vintage-cream placeholder-vintage-cream/50 focus:outline-none focus:border-vintage-gold"
                            />
                            <button className="btn-vintage">
                                {t('footer.subscribe')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-vintage-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-vintage-cream/60">
                        © {new Date().getFullYear()} Shop Đồ Cổ. {t('footer.rights')}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer


