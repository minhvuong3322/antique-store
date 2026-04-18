import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Heart, Share2, ChevronLeft, Star, Loader2, Check, HeartIcon } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const ProductDetailPage = () => {
    const { id } = useParams()
    const { t, i18n } = useTranslation()
    const [selectedImage, setSelectedImage] = useState(0)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [addedToCart, setAddedToCart] = useState(false)
    const [quantity, setQuantity] = useState(1)

    // Contexts
    const { addToCart, isInCart, getItemQuantity } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()

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

    // Handlers for the action buttons
    const handleAddToCart = () => {
        if (!product || product.stock_quantity <= 0) return

        addToCart(product, quantity)
        setAddedToCart(true)

        // Reset the added state after 2 seconds
        setTimeout(() => {
            setAddedToCart(false)
        }, 2000)
    }

    const handleToggleWishlist = () => {
        if (!product) return
        toggleWishlist(product)
    }

    const handleShare = async () => {
        const url = window.location.href
        const title = product?.name || 'Sản phẩm từ Shop Đồ Cổ'
        const text = `Xem sản phẩm này: ${title}`

        // Check if Web Share API is available and we're in a secure context
        if (navigator.share && window.isSecureContext) {
            try {
                await navigator.share({
                    title,
                    text,
                    url
                })
                return
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('Web Share API failed, falling back to clipboard')
                }
                // Continue to fallback if sharing was cancelled or failed
            }
        }

        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(url)
            // Show success message without using alert
            const message = document.createElement('div')
            message.textContent = '✅ Đã sao chép link sản phẩm!'
            message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300'
            document.body.appendChild(message)

            setTimeout(() => {
                message.style.opacity = '0'
                setTimeout(() => {
                    document.body.removeChild(message)
                }, 300)
            }, 2000)
        } catch (error) {
            // Final fallback for older browsers
            try {
                const textArea = document.createElement('textarea')
                textArea.value = url
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)

                // Show success message
                const message = document.createElement('div')
                message.textContent = '✅ Đã sao chép link sản phẩm!'
                message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300'
                document.body.appendChild(message)

                setTimeout(() => {
                    message.style.opacity = '0'
                    setTimeout(() => {
                        document.body.removeChild(message)
                    }, 300)
                }, 2000)
            } catch (fallbackError) {
                console.error('Failed to copy to clipboard:', fallbackError)
                // Show error message
                const message = document.createElement('div')
                message.textContent = '❌ Không thể sao chép link'
                message.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300'
                document.body.appendChild(message)

                setTimeout(() => {
                    message.style.opacity = '0'
                    setTimeout(() => {
                        document.body.removeChild(message)
                    }, 300)
                }, 2000)
            }
        }
    }

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

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-vintage-wood dark:text-vintage-lightwood font-serif">
                                Số lượng:
                            </label>
                            <div className="flex items-center border-2 border-vintage-gold rounded-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 hover:bg-vintage-gold/10 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-x border-vintage-gold/20 min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product?.stock_quantity || 1, quantity + 1))}
                                    className="px-3 py-1 hover:bg-vintage-gold/10 transition-colors"
                                    disabled={quantity >= (product?.stock_quantity || 1)}
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                (Còn {product?.stock_quantity || 0} sản phẩm)
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product || product.stock_quantity <= 0 || addedToCart}
                                className={`flex-1 btn-vintage flex items-center justify-center transition-all duration-300 ${addedToCart
                                    ? 'bg-green-600 hover:bg-green-700 border-green-600'
                                    : product?.stock_quantity <= 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        Đã thêm vào giỏ
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        {product?.stock_quantity <= 0 ? 'Hết hàng' : t('home.add_to_cart')}
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleToggleWishlist}
                                className={`p-3 border-2 rounded-md transition-all duration-300 ${product && isInWishlist(product.id)
                                    ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                                    : 'border-vintage-gold text-vintage-gold hover:bg-vintage-gold/10'
                                    }`}
                                title={product && isInWishlist(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                            >
                                <Heart
                                    className={`w-6 h-6 transition-all duration-300 ${product && isInWishlist(product.id) ? 'fill-current' : ''
                                        }`}
                                />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-3 border-2 border-vintage-gold rounded-md hover:bg-vintage-gold/10 transition-colors"
                                title="Chia sẻ sản phẩm"
                            >
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


