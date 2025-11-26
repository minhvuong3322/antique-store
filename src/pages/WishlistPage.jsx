import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Heart, ShoppingCart, Eye, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/format'

const WishlistPage = () => {
    const { t } = useTranslation()
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
    const { addToCart } = useCart()

    const handleAddToCart = (product) => {
        addToCart(product, 1)
        // Optionally remove from wishlist after adding to cart
        // removeFromWishlist(product.id)
    }

    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId)
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Heart className="w-24 h-24 mx-auto text-vintage-gold/30 mb-8" />
                        <h1 className="font-elegant text-4xl text-vintage-darkwood dark:text-vintage-gold mb-6">
                            Danh Sách Yêu Thích
                        </h1>
                        <p className="text-lg text-vintage-wood dark:text-vintage-lightwood mb-8">
                            Bạn chưa có sản phẩm nào trong danh sách yêu thích
                        </p>
                        <Link
                            to="/products"
                            className="btn-vintage inline-flex items-center"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Khám phá sản phẩm
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-elegant text-4xl text-vintage-darkwood dark:text-vintage-gold mb-2">
                                Danh Sách Yêu Thích
                            </h1>
                            <p className="text-vintage-wood dark:text-vintage-lightwood">
                                {wishlistItems.length} sản phẩm yêu thích
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="flex items-center space-x-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Xóa tất cả</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => {
                        const productImages = product.images ?
                            (Array.isArray(product.images) ? product.images : product.images.split(',')) : []
                        const defaultImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'

                        return (
                            <div
                                key={product.id}
                                className="card-vintage group relative p-4"
                            >
                                {/* Remove from Wishlist Button */}
                                <button
                                    onClick={() => handleRemoveFromWishlist(product.id)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    title="Xóa khỏi yêu thích"
                                >
                                    <Heart className="w-5 h-5 fill-current text-red-500 hover:text-white" />
                                </button>

                                {/* Product Image */}
                                <div className="aspect-square overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={productImages[0] || defaultImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = defaultImage
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="font-serif text-lg font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="mb-4">
                                        {product.sale_price ? (
                                            <div>
                                                <p className="text-xl font-bold text-red-600">
                                                    {formatCurrency(product.sale_price)}
                                                </p>
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(product.price)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xl font-bold text-vintage-bronze">
                                                {formatCurrency(product.price)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-4 space-y-1">
                                        {product.year_manufactured && (
                                            <p>Năm sản xuất: {product.year_manufactured}</p>
                                        )}
                                        {product.origin && (
                                            <p>Xuất xứ: {product.origin}</p>
                                        )}
                                        {product.condition && (
                                            <p>Tình trạng: {product.condition}</p>
                                        )}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="mb-4">
                                        <p className={`text-sm font-medium ${product.stock_quantity > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}>
                                            {product.stock_quantity > 0
                                                ? `Còn ${product.stock_quantity} sản phẩm`
                                                : 'Hết hàng'
                                            }
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-white rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            <span className="text-sm">Xem</span>
                                        </Link>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock_quantity <= 0}
                                            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${product.stock_quantity > 0
                                                    ? 'bg-vintage-gold text-white hover:bg-vintage-bronze'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {product.stock_quantity > 0 ? 'Thêm giỏ' : 'Hết hàng'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Back to Shopping */}
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="btn-vintage inline-flex items-center"
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WishlistPage
