import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';
import { CreditCard, Wallet, Building, CheckCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        district: '',
        note: '',
        payment_method: 'COD',
    });

    const [loading, setLoading] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems.length, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check authentication
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đặt hàng');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }

        setLoading(true);

        try {
            // Prepare order data for API
            const shippingAddress = `${formData.address}, ${formData.district}, ${formData.city}`;
            
            const orderData = {
                shipping_address: shippingAddress,
                notes: formData.note,
                payment_method: formData.payment_method,
                cart_items: cartItems.map(item => ({
                    id: item.id,
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            console.log('Creating order with data:', orderData);

            // Call API to create order
            const response = await orderService.createOrder(orderData);
            console.log('Order response:', response);

            // Handle different response structures
            const order = response?.data?.data?.order || response?.data?.order;
            
            if (order && order.id) {
                // Nếu là thanh toán online (VNPay, Momo), tạo payment URL
                if (formData.payment_method === 'VNPay' || formData.payment_method === 'Momo') {
                    try {
                        // Tạo payment URL
                        const paymentResponse = formData.payment_method === 'VNPay'
                            ? await paymentService.createVNPayPayment(order.id)
                            : await paymentService.createMomoPayment(order.id);
                        
                        const paymentUrl = paymentResponse?.data?.data?.payment_url;
                        
                        if (paymentUrl) {
                            // Mở cửa sổ thanh toán
                            const paymentWindow = window.open(
                                paymentUrl,
                                'payment',
                                'width=800,height=600,scrollbars=yes,resizable=yes'
                            );

                            // Bắt đầu polling để check payment status
                            toast.success('Đang chuyển đến trang thanh toán...', { duration: 2000 });
                            
                            // Poll payment status
                            paymentService.pollPaymentStatus(order.order_number || order.id, {
                                maxAttempts: 120, // 4 phút (120 * 2s)
                                interval: 2000,
                                onUpdate: (status) => {
                                    if (status === 'completed' || status === 'failed') {
                                        // Đóng cửa sổ thanh toán nếu đã mở
                                        if (paymentWindow && !paymentWindow.closed) {
                                            paymentWindow.close();
                                        }
                                    }
                                },
                                onComplete: (data) => {
                                    clearCart();
                                    toast.success('Thanh toán thành công! 🎉', { duration: 5000 });
                                    setTimeout(() => {
                                        navigate(`/orders/${order.id}`, {
                                            state: { 
                                                message: 'Cảm ơn bạn đã thanh toán! Đơn hàng của bạn đã được xác nhận.',
                                                paymentSuccess: true
                                            }
                                        });
                                    }, 1500);
                                },
                                onError: (error) => {
                                    if (error?.error === 'Payment failed') {
                                        toast.error('Thanh toán thất bại. Vui lòng thử lại.', { duration: 5000 });
                                        setTimeout(() => {
                                            navigate(`/orders/${order.id}`, {
                                                state: { 
                                                    message: 'Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.',
                                                    paymentFailed: true
                                                }
                                            });
                                        }, 1500);
                                    } else if (error?.error !== 'Timeout') {
                                        // Không hiển thị lỗi nếu chỉ là timeout (có thể user đang thanh toán)
                                        console.error('Payment status check error:', error);
                                    }
                                }
                            });
                            
                            // Không clear cart và redirect ngay, chờ thanh toán
                            return;
                        }
                    } catch (paymentError) {
                        console.error('Payment URL creation error:', paymentError);
                        toast.error('Không thể tạo link thanh toán. Vui lòng thử lại.');
                        // Fallback: vẫn tạo order thành công, user có thể thanh toán sau
                    }
                }

                // COD hoặc BankTransfer - không cần redirect thanh toán
                clearCart();
                toast.success('Đặt hàng thành công! 🎉');

                // Redirect to order detail page
                setTimeout(() => {
                    navigate(`/orders/${order.id}`, {
                        state: { message: 'Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.' }
                    });
                }, 1000);
            } else {
                throw new Error('Invalid order response');
            }

        } catch (error) {
            console.error('Order error:', error);
            console.error('Error details:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
                                            placeholder="0928 172 081"
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
                                            value="BankTransfer"
                                            checked={formData.payment_method === 'BankTransfer'}
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

                                    <label className="flex items-center p-4 border-2 border-vintage-gold/30 rounded-lg cursor-pointer hover:bg-vintage-gold/5 transition">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="VNPay"
                                            checked={formData.payment_method === 'VNPay'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <CreditCard className="w-5 h-5 mr-3 text-vintage-gold" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                Thanh toán VNPay
                                            </p>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                ATM, Thẻ tín dụng, QR Code
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
