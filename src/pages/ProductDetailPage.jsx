import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Heart, Share2, ChevronLeft, Star, Loader2 } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { productService } from '../services/productService'

const ProductDetailPage = () => {
    const { id } = useParams()
    const { t, i18n } = useTranslation()
    const [selectedImage, setSelectedImage] = useState(0)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await productService.getProductById(id)
                console.log('API Response:', response)
                console.log('Response data:', response.data)
                setProduct(response.data.product)
            } catch (err) {
                console.error('Error fetching product:', err)
                console.error('Error response:', err.response)
                setError(err.response?.data?.message || 'Không thể tải sản phẩm')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-vintage-gold mx-auto mb-4" />
                    <p className="text-vintage-wood dark:text-vintage-lightwood">Đang tải sản phẩm...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-elegant text-3xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                        {error || 'Không tìm thấy sản phẩm'}
                    </h2>
                    <Link to="/products" className="btn-vintage">
                        Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        )
    }

    const isVietnamese = i18n.language === 'vi'
    const productName = product.name || 'Sản phẩm'
    const productDescription = product.description || 'Chưa có mô tả'
    const productImages = product.images ? (Array.isArray(product.images) ? product.images : product.images.split(',')) : []
    const defaultImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Link
                    to="/products"
                    className="inline-flex items-center text-vintage-wood dark:text-vintage-lightwood hover:text-vintage-gold mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Quay lại danh sách sản phẩm
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-square rounded-xl overflow-hidden shadow-vintage-lg mb-4">
                            <img
                                src={productImages[selectedImage] || productImages[0] || defaultImage}
                                alt={productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = defaultImage
                                }}
                            />
                        </div>

                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden ${selectedImage === idx
                                            ? 'ring-4 ring-vintage-gold'
                                            : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${productName} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = defaultImage
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Badges */}
                        <div className="flex gap-2 mb-4">
                            {product.is_featured && (
                                <span className="px-3 py-1 bg-vintage-bronze text-white text-sm font-semibold rounded-full">
                                    ⭐ Nổi bật
                                </span>
                            )}
                            {product.sale_price && (
                                <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                                    🏷️ Giảm giá
                                </span>
                            )}
                            {product.category?.name && (
                                <span className="px-3 py-1 bg-vintage-gold/20 text-vintage-gold text-sm font-semibold rounded-full">
                                    {product.category.name}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="font-elegant text-4xl md:text-5xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                            {productName}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 fill-vintage-gold text-vintage-gold" />
                                ))}
                            </div>
                            <span className="text-vintage-wood dark:text-vintage-lightwood">(5.0)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <p className="text-vintage-wood dark:text-vintage-lightwood font-serif mb-2">
                                {t('product.price')}
                            </p>
                            {product.sale_price ? (
                                <div>
                                    <p className="font-elegant text-5xl text-red-600">
                                        {formatCurrency(product.sale_price)}
                                    </p>
                                    <p className="text-2xl text-gray-500 line-through mt-1">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            ) : (
                                <p className="font-elegant text-5xl text-vintage-bronze">
                                    {formatCurrency(product.price)}
                                </p>
                            )}
                        </div>

                        <div className="divider-vintage mb-6"></div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {product.year_manufactured && (
                                <div>
                                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                                        Năm sản xuất
                                    </p>
                                    <p className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                        {product.year_manufactured}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                                    {t('product.origin')}
                                </p>
                                <p className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                    {product.origin || 'Việt Nam'}
                                </p>
                            </div>
                            {product.condition && (
                                <div>
                                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                                        {t('product.condition')}
                                    </p>
                                    <p className="font-serif font-semibold text-vintage-sage">
                                        {product.condition}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                                    Tình trạng kho
                                </p>
                                <p className={`font-serif font-semibold ${(product.stock_quantity > 0) ? 'text-vintage-sage' : 'text-vintage-rust'
                                    }`}>
                                    {product.stock_quantity > 0 ? `Còn ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button className="flex-1 btn-vintage flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {t('home.add_to_cart')}
                            </button>
                            <button className="p-3 border-2 border-vintage-gold rounded-md hover:bg-vintage-gold/10 transition-colors">
                                <Heart className="w-6 h-6 text-vintage-gold" />
                            </button>
                            <button className="p-3 border-2 border-vintage-gold rounded-md hover:bg-vintage-gold/10 transition-colors">
                                <Share2 className="w-6 h-6 text-vintage-gold" />
                            </button>
                        </div>

                        <div className="divider-vintage mb-6"></div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-3">
                                {t('product.description')}
                            </h3>
                            <p className="text-vintage-wood dark:text-vintage-lightwood leading-relaxed">
                                {productDescription}
                            </p>
                        </div>

                        {/* Specifications */}
                        {product.specifications && (
                            <div>
                                <h3 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-3">
                                    {t('product.specifications')}
                                </h3>
                                <div className="card-vintage p-4">
                                    {typeof product.specifications === 'object' ? (
                                        Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-2 border-b border-vintage-gold/10 last:border-0">
                                                <span className="text-vintage-wood dark:text-vintage-lightwood capitalize">
                                                    {key}
                                                </span>
                                                <span className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                    {value}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-vintage-wood dark:text-vintage-lightwood">
                                            {product.specifications}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage


