import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Eye, Heart, Share2 } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

const ProductCard = ({ product }) => {
    const { i18n, t } = useTranslation()
    const { addToCart, isInCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const isVietnamese = i18n.language === 'vi'

    // Handle both backend and mock data formats
    const productName = product.name || product.nameEn || 'Sản phẩm'
    const productOrigin = product.origin || product.originEn || 'Việt Nam'
    const productImages = product.images || []
    const productImage = Array.isArray(productImages) ? productImages[0] : productImages
    
    // Multiple fallback images for better reliability
    const fallbackImages = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        'https://images.unsplash.com/photo-1548509927-9466e27c8b7c?w=400'
    ]
    const defaultImage = fallbackImages[0]

    // State for image loading and error handling
    const [imageError, setImageError] = useState(false)
    const [fallbackIndex, setFallbackIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Check if already in cart/wishlist
    const inCart = isInCart(product.id)
    const inWishlist = isInWishlist(product.id)

    // Handle add to cart
    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, 1)
        toast.success('Đã thêm vào giỏ hàng! 🛒')
    }

    // Handle toggle wishlist
    const handleToggleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // Toast notification is handled in WishlistContext
        toggleWishlist(product)
    }

    // Handle share
    const handleShare = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const url = `${window.location.origin}/products/${product.id}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    text: `Xem sản phẩm: ${productName}`,
                    url: url
                })
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(url)
                }
            }
        } else {
            copyToClipboard(url)
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Đã sao chép link sản phẩm! 📋')
    }

    // Handle image error with fallback rotation
    const handleImageError = (e) => {
        setIsLoading(false)
        setImageError(true)
        
        // Try next fallback image
        if (fallbackIndex < fallbackImages.length - 1) {
            const nextIndex = fallbackIndex + 1
            setFallbackIndex(nextIndex)
            e.target.src = fallbackImages[nextIndex]
        } else {
            // All fallbacks failed, use solid color placeholder
            e.target.style.display = 'none'
        }
    }

    // Handle image load success
    const handleImageLoad = () => {
        setIsLoading(false)
        setImageError(false)
    }

    return (
        <div className="card-vintage group overflow-hidden flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-vintage-ivory dark:bg-dark-bg">
                {/* Loading skeleton */}
                {isLoading && !imageError && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                )}
                
                {/* Product Image */}
                <img
                    src={productImage || fallbackImages[fallbackIndex]}
                    alt={productName}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
                
                {/* Fallback placeholder when all images fail */}
                {imageError && fallbackIndex >= fallbackImages.length - 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vintage-darkwood/20 to-vintage-wood/20">
                        <div className="text-center p-8">
                            <div className="text-6xl mb-4">🏺</div>
                            <p className="text-vintage-darkwood dark:text-vintage-cream font-serif text-sm">Hình ảnh</p>
                            <p className="text-vintage-wood dark:text-vintage-lightwood text-xs">Đang cập nhật</p>
                        </div>
                    </div>
                )}

                {/* Overlay with actions - shown on hover */}
                <div className="absolute inset-0 bg-vintage-darkwood/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Link
                        to={`/products/${product.id}`}
                        className="p-3 bg-vintage-gold rounded-full hover:bg-vintage-bronze transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye className="w-5 h-5 text-vintage-darkwood" />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        className={`p-3 rounded-full transition-colors ${inCart
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-vintage-gold hover:bg-vintage-bronze'
                            }`}
                        title={inCart ? 'Đã có trong giỏ' : 'Thêm vào giỏ'}
                    >
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-3 rounded-full transition-colors ${inWishlist
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-vintage-gold hover:bg-vintage-bronze'
                            }`}
                        title={inWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                    >
                        <Heart
                            className={`w-5 h-5 ${inWishlist ? 'text-white fill-white' : 'text-vintage-darkwood'}`}
                        />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-3 bg-vintage-gold rounded-full hover:bg-vintage-bronze transition-colors"
                        title="Chia sẻ"
                    >
                        <Share2 className="w-5 h-5 text-vintage-darkwood" />
                    </button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {(product.isUnique || product.is_featured) && (
                        <span className="px-3 py-1 bg-vintage-bronze text-white text-xs font-semibold rounded-full shadow-lg">
                            {product.isUnique ? t('product.unique') : '⭐ Nổi bật'}
                        </span>
                    )}
                    {product.sale_price && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            🏷️ Giảm giá
                        </span>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                
                {/* Phần nội dung chính (sẽ co giãn) */}
                <div className="flex-grow">
                    {/* Category & Era */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-vintage-gold font-serif uppercase tracking-wider">
                            {product.category?.name || product.category || 'Đồ cổ'}
                        </span>
                        <span className="text-xs text-vintage-wood dark:text-vintage-lightwood">
                            {product.year_manufactured || product.era || 'Cổ điển'}
                        </span>
                    </div>

                    {/* Product Name */}
                    <Link to={`/products/${product.id}`}>
                        <h3 className="font-serif text-lg font-semibold text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold dark:hover:text-vintage-gold transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
                            {productName}
                        </h3>
                    </Link>

                    {/* Origin */}
                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-3">
                        📍 {productOrigin}
                    </p>
                </div>
                
                {/* Phần đáy (sẽ bị đẩy xuống) */}
                <div>
                    {/* Divider */}
                    <div className="divider-vintage my-3"></div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-vintage-wood dark:text-vintage-lightwood mb-1">
                            {t('product.price')}
                        </p>
                        {product.sale_price ? (
                            <div>
                                <p className="font-serif text-xl font-bold text-red-600">
                                    {formatCurrency(product.sale_price)}
                                </p>
                                <p className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <p className="font-serif text-xl font-bold text-vintage-bronze">
                                    {formatCurrency(product.price)}
                                </p>
                                {/* Dòng giá trị ẩn để tạo khoảng trống cho dòng gạch ngang */}
                                <p className="text-sm text-gray-500 line-through opacity-0">
                                    {formatCurrency(0)}
                                </p>
                            </div>
                        )}
                    </div>

                    <Link
                        to={`/products/${product.id}`}
                        className="btn-outline-vintage text-sm px-4 py-2"
                    >
                        {t('home.view_details')}
                    </Link>
                </div>

                    {/* Stock Status */}
                    <div className="mt-3 pt-3 border-t border-vintage-gold/10">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-vintage-wood dark:text-vintage-lightwood">
                                Tình trạng:
                            </span>
                            <span className={`font-semibold ${(product.stock_quantity || product.inStock) > 0
                                ? 'text-vintage-sage'
                                : 'text-vintage-rust'
                                }`}>
                                {product.condition || (product.stock_quantity > 0 ? 'Còn hàng' : 'Hết hàng')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard


