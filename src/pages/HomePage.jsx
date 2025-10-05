import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '../components/products/ProductCard'
import { mockCategories } from '../data/mockData'
import { productService } from '../services/productService'

const HomePage = () => {
    const { t } = useTranslation()
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch featured products from API
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true)
                const response = await productService.getFeaturedProducts(6)
                if (response.success) {
                    setFeaturedProducts(response.data.products)
                }
            } catch (error) {
                console.error('Error fetching featured products:', error)
                setFeaturedProducts([]) // Fallback to empty array
            } finally {
                setLoading(false)
            }
        }

        fetchFeaturedProducts()
    }, [])

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-vintage-darkwood via-vintage-wood to-vintage-darkwood text-vintage-cream overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-pattern-vintage opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="space-y-6 z-10">
                            <div className="inline-block">
                                <span className="px-4 py-2 bg-vintage-gold/20 border border-vintage-gold rounded-full text-vintage-gold text-sm font-serif">
                                    ✨ Bộ Sưu Tập Độc Quyền
                                </span>
                            </div>

                            <h1 className="font-elegant text-5xl md:text-6xl lg:text-7xl leading-tight">
                                {t('hero.title')}
                            </h1>

                            <p className="text-lg md:text-xl text-vintage-cream/90 font-serif max-w-lg">
                                {t('hero.subtitle')}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/products" className="btn-vintage group">
                                    {t('hero.cta')}
                                    <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/about" className="btn-outline-vintage border-vintage-cream text-vintage-cream hover:bg-vintage-cream hover:text-vintage-darkwood">
                                    {t('hero.learn_more')}
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-vintage-lg border-4 border-vintage-gold/30">
                                <img
                                    src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"
                                    alt="Featured Antique"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-vintage-gold text-vintage-darkwood p-6 rounded-xl shadow-vintage-lg">
                                <div className="text-4xl font-bold">500+</div>
                                <div className="text-sm font-serif">Sản phẩm quý hiếm</div>
                            </div>

                            <div className="absolute -top-6 -right-6 bg-vintage-bronze text-white p-6 rounded-xl shadow-vintage-lg">
                                <div className="text-4xl font-bold">100%</div>
                                <div className="text-sm font-serif">Xác thực</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" className="w-full h-16 fill-vintage-cream dark:fill-dark-bg">
                        <path d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-vintage-cream dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'Xác Thực 100%', desc: 'Đảm bảo nguồn gốc rõ ràng' },
                            { icon: Award, title: 'Chất Lượng Cao', desc: 'Được chuyên gia thẩm định' },
                            { icon: Truck, title: 'Giao Hàng An Toàn', desc: 'Đóng gói chuyên nghiệp' },
                            { icon: Star, title: 'Tư Vấn Tận Tâm', desc: 'Hỗ trợ 24/7' },
                        ].map((feature, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-vintage-gold/10 rounded-full mb-4 group-hover:bg-vintage-gold/20 transition-colors">
                                    <feature.icon className="w-8 h-8 text-vintage-gold" />
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white dark:bg-dark-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-elegant text-4xl md:text-5xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                            {t('home.collection_title')}
                        </h2>
                        <div className="divider-vintage max-w-xs mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {mockCategories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.id}`}
                                className="card-vintage p-6 text-center hover:shadow-vintage-lg"
                            >
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-vintage-wood dark:text-vintage-lightwood mt-1">
                                    {category.nameEn}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-vintage-cream dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="font-elegant text-4xl md:text-5xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                                {t('home.featured_title')}
                            </h2>
                            <p className="text-vintage-wood dark:text-vintage-lightwood font-serif text-lg">
                                {t('home.featured_subtitle')}
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="btn-outline-vintage hidden md:inline-flex items-center group"
                        >
                            {t('home.view_all')}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            ))
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-vintage-wood dark:text-vintage-lightwood text-lg">
                                    Đang cập nhật sản phẩm mới...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Mobile View All Button */}
                    <div className="mt-8 text-center md:hidden">
                        <Link to="/products" className="btn-vintage inline-flex items-center">
                            {t('home.view_all')}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-vintage-darkwood to-vintage-wood text-vintage-cream">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-elegant text-4xl md:text-5xl mb-6">
                        Bắt Đầu Bộ Sưu Tập Của Bạn
                    </h2>
                    <p className="text-lg md:text-xl text-vintage-cream/90 font-serif mb-8 max-w-2xl mx-auto">
                        Mỗi món đồ cổ là một câu chuyện, một mảnh ghép của lịch sử.
                        Hãy để chúng tôi giúp bạn tìm kiếm những kho báu quý giá.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/products" className="btn-vintage">
                            Khám Phá Bộ Sưu Tập
                        </Link>
                        <Link to="/contact" className="btn-outline-vintage border-vintage-cream text-vintage-cream hover:bg-vintage-cream hover:text-vintage-darkwood">
                            Liên Hệ Tư Vấn
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage


