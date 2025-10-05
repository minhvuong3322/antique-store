import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        getCartTotal,
        getCartItemsCount,
    } = useCart();

    const handleRemove = (productId, productName) => {
        removeFromCart(productId);
        toast.success(`Đã xóa "${productName}" khỏi giỏ hàng`);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="inline-block p-8 bg-vintage-ivory dark:bg-dark-card rounded-full mb-6">
                            <ShoppingBag className="w-16 h-16 text-vintage-wood dark:text-vintage-lightwood" />
                        </div>
                        <h2 className="font-elegant text-3xl text-vintage-darkwood dark:text-vintage-cream mb-4">
                            Giỏ Hàng Trống
                        </h2>
                        <p className="text-vintage-wood dark:text-vintage-lightwood mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng
                        </p>
                        <Link
                            to="/products"
                            className="btn-vintage inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Tiếp Tục Mua Sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-elegant text-4xl text-vintage-darkwood dark:text-vintage-gold mb-2">
                        Giỏ Hàng
                    </h1>
                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                        Bạn có {getCartItemsCount()} sản phẩm trong giỏ hàng
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const productImage = Array.isArray(item.images)
                                ? item.images[0]
                                : item.images;
                            const price = item.sale_price || item.price;

                            return (
                                <div
                                    key={item.id}
                                    className="card-vintage p-4 flex flex-col sm:flex-row gap-4"
                                >
                                    {/* Product Image */}
                                    <Link
                                        to={`/products/${item.id}`}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={productImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200'}
                                            alt={item.name}
                                            className="w-32 h-32 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200';
                                            }}
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <Link to={`/products/${item.id}`}>
                                            <h3 className="font-serif text-lg font-semibold text-vintage-darkwood dark:text-vintage-cream hover:text-vintage-gold transition mb-2">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-2">
                                            📍 {item.origin || 'Việt Nam'}
                                        </p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                    Đơn giá:
                                                </p>
                                                <p className="font-serif text-lg font-bold text-vintage-bronze">
                                                    {formatCurrency(price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border-2 border-vintage-gold rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="p-2 hover:bg-vintage-gold/10 transition"
                                                    title="Giảm số lượng"
                                                >
                                                    <Minus className="w-4 h-4 text-vintage-darkwood dark:text-vintage-cream" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold text-vintage-darkwood dark:text-vintage-cream min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="p-2 hover:bg-vintage-gold/10 transition"
                                                    title="Tăng số lượng"
                                                >
                                                    <Plus className="w-4 h-4 text-vintage-darkwood dark:text-vintage-cream" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right">
                                        <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                                            Thành tiền:
                                        </p>
                                        <p className="font-serif text-xl font-bold text-vintage-bronze">
                                            {formatCurrency(price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card-vintage p-6 sticky top-24">
                            <h3 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                                Tổng Đơn Hàng
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-vintage-wood dark:text-vintage-lightwood">
                                    <span>Tạm tính:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(getCartTotal())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-vintage-wood dark:text-vintage-lightwood">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-semibold text-vintage-sage">
                                        Miễn phí
                                    </span>
                                </div>
                                <div className="divider-vintage"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                        Tổng cộng:
                                    </span>
                                    <span className="font-serif text-2xl font-bold text-vintage-bronze">
                                        {formatCurrency(getCartTotal())}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn-vintage w-full mb-4"
                            >
                                Tiến Hành Thanh Toán
                            </button>

                            <Link
                                to="/products"
                                className="btn-outline-vintage w-full flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Tiếp Tục Mua Sắm
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-vintage-gold/20">
                                <div className="space-y-3 text-sm text-vintage-wood dark:text-vintage-lightwood">
                                    <div className="flex items-center gap-2">
                                        <span className="text-vintage-sage">✓</span>
                                        <span>Miễn phí vận chuyển toàn quốc</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-vintage-sage">✓</span>
                                        <span>Đổi trả trong 7 ngày</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-vintage-sage">✓</span>
                                        <span>Thanh toán an toàn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
