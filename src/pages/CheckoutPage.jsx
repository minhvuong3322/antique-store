import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';
import { CreditCard, Wallet, Building, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        note: '',
        payment_method: 'COD',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock order data
            const orderData = {
                ...formData,
                items: cartItems,
                total: getCartTotal(),
                order_date: new Date().toISOString(),
            };

            console.log('Order placed:', orderData);

            // Clear cart and show success
            clearCart();
            toast.success('Đặt hàng thành công! 🎉');

            // Redirect to success page (you can create this later)
            setTimeout(() => {
                navigate('/', {
                    state: { message: 'Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.' }
                });
            }, 1500);

        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-elegant text-4xl text-vintage-darkwood dark:text-vintage-gold mb-8">
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Shipping Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Info */}
                            <div className="card-vintage p-6">
                                <h2 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                                    Thông Tin Người Nhận
                                </h2>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="0987654321"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Địa chỉ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="123 Đường ABC"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Thành phố <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="TP. Hồ Chí Minh"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Quận/Huyện <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="Quận 1"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Ghi chú (tùy chọn)
                                        </label>
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-vintage-gold/30 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold transition"
                                            placeholder="Ghi chú về đơn hàng..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="card-vintage p-6">
                                <h2 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                                    Phương Thức Thanh Toán
                                </h2>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 border-vintage-gold/30 rounded-lg cursor-pointer hover:bg-vintage-gold/5 transition">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="COD"
                                            checked={formData.payment_method === 'COD'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <Wallet className="w-5 h-5 mr-3 text-vintage-gold" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                Thanh toán khi nhận hàng (COD)
                                            </p>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                Thanh toán bằng tiền mặt khi nhận hàng
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 border-vintage-gold/30 rounded-lg cursor-pointer hover:bg-vintage-gold/5 transition">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="BANK"
                                            checked={formData.payment_method === 'BANK'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <Building className="w-5 h-5 mr-3 text-vintage-gold" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                Chuyển khoản ngân hàng
                                            </p>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                Chuyển khoản qua ngân hàng
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 border-vintage-gold/30 rounded-lg cursor-pointer hover:bg-vintage-gold/5 transition opacity-50">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="CARD"
                                            disabled
                                            className="mr-3"
                                        />
                                        <CreditCard className="w-5 h-5 mr-3 text-vintage-gold" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                Thẻ tín dụng/ghi nợ
                                            </p>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                Đang phát triển...
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card-vintage p-6 sticky top-24">
                                <h2 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                                    Đơn Hàng
                                </h2>

                                {/* Products */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map(item => {
                                        const price = item.sale_price || item.price;
                                        return (
                                            <div key={item.id} className="flex gap-3 pb-3 border-b border-vintage-gold/10">
                                                <img
                                                    src={Array.isArray(item.images) ? item.images[0] : item.images}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100'}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-vintage-wood dark:text-vintage-lightwood">
                                                        SL: {item.quantity} x {formatCurrency(price)}
                                                    </p>
                                                    <p className="text-sm font-semibold text-vintage-bronze">
                                                        {formatCurrency(price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-vintage-wood dark:text-vintage-lightwood">
                                        <span>Tạm tính:</span>
                                        <span>{formatCurrency(getCartTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-vintage-wood dark:text-vintage-lightwood">
                                        <span>Phí vận chuyển:</span>
                                        <span className="text-vintage-sage">Miễn phí</span>
                                    </div>
                                    <div className="divider-vintage"></div>
                                    <div className="flex justify-between text-lg font-serif font-bold">
                                        <span className="text-vintage-darkwood dark:text-vintage-cream">Tổng cộng:</span>
                                        <span className="text-vintage-bronze">{formatCurrency(getCartTotal())}</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-vintage w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Đặt Hàng
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-vintage-wood dark:text-vintage-lightwood mt-4">
                                    Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
