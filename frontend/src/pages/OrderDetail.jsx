import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-hot-toast';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    TruckIcon,
    ClockIcon,
    XCircleIcon,
    MapPinIcon,
    PhoneIcon,
    CreditCardIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasProcessedMessage = useRef(false); // Để đảm bảo chỉ xử lý message 1 lần

    useEffect(() => {
        fetchOrderDetail();
        // Reset flag khi order ID thay đổi
        hasProcessedMessage.current = false;
    }, [id]);

    useEffect(() => {
        // Hiển thị thông báo từ state (khi redirect từ checkout sau thanh toán)
        // Chỉ xử lý 1 lần bằng useRef để tránh duplicate trong StrictMode
        const currentMessage = location.state?.message;
        const toastId = 'order-success-message'; // ID cố định để tránh duplicate
        
        if (currentMessage && !hasProcessedMessage.current) {
            hasProcessedMessage.current = true; // Đánh dấu đã xử lý
            
            // Dismiss toast cũ nếu có (với cùng id) để đảm bảo chỉ có 1 toast
            toast.dismiss(toastId);
            
            // Hiển thị toast mới với id cố định (react-hot-toast sẽ tự động replace toast cùng id)
            if (location.state.paymentSuccess) {
                toast.success(currentMessage, { 
                    duration: 5000,
                    id: toastId
                });
            } else if (location.state.paymentFailed) {
                toast.error(currentMessage, { 
                    duration: 5000,
                    id: toastId
                });
            } else {
                toast.success(currentMessage, { 
                    duration: 3000,
                    id: toastId
                });
            }
            
            // Clear state ngay sau khi hiển thị
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.message]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(id);
            setOrder(response.data.order);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            await orderService.cancelOrder(id);
            toast.success('Đã hủy đơn hàng thành công');
            fetchOrderDetail();
        } catch (error) {
            toast.error(error.message || 'Không thể hủy đơn hàng');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderProgress = () => {
        const steps = [
            { status: 'pending', label: 'Chờ xác nhận', icon: ClockIcon },
            { status: 'confirmed', label: 'Đã xác nhận', icon: CheckCircleIcon },
            { status: 'shipping', label: 'Đang giao hàng', icon: TruckIcon },
            { status: 'delivered', label: 'Đã giao hàng', icon: CheckCircleIcon }
        ];

        if (order.status === 'cancelled') {
            return [
                { status: 'cancelled', label: 'Đã hủy', icon: XCircleIcon, active: true, completed: false }
            ];
        }

        const currentIndex = steps.findIndex(step => step.status === order.status);

        return steps.map((step, index) => ({
            ...step,
            active: index === currentIndex,
            completed: index < currentIndex
        }));
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-bronze"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
                <Link to="/my-orders" className="text-vintage-bronze hover:underline">
                    Quay lại danh sách đơn hàng
                </Link>
            </div>
        );
    }

    const orderSteps = getOrderProgress();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-vintage-bronze dark:text-vintage-gold hover:underline mb-6"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Quay lại</span>
            </button>

            {/* Order Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-vintage-bronze dark:text-vintage-gold mb-1">
                            Đơn hàng #{order.order_number}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Đặt ngày {formatDate(order.created_at)}
                        </p>
                    </div>
                    {order.status === 'pending' && (
                        <button
                            onClick={handleCancelOrder}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Hủy đơn hàng
                        </button>
                    )}
                </div>

                {/* Order Progress Timeline */}
                <div className="mt-8">
                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" style={{ zIndex: 0 }}>
                            <div
                                className={`h-full transition-all duration-500 ${order.status === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                style={{
                                    width: order.status === 'cancelled' ? '100%' :
                                        order.status === 'pending' ? '0%' :
                                            order.status === 'confirmed' ? '33%' :
                                                order.status === 'shipping' ? '66%' :
                                                    order.status === 'delivered' ? '100%' : '0%'
                                }}
                            />
                        </div>

                        {/* Steps */}
                        {orderSteps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div key={index} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${step.completed
                                            ? 'bg-green-500 text-white'
                                            : step.active && order.status === 'cancelled'
                                                ? 'bg-red-500 text-white'
                                                : step.active
                                                    ? 'bg-vintage-bronze text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                        }`}>
                                        <StepIcon className="w-6 h-6" />
                                    </div>
                                    <div className={`text-sm font-medium text-center ${step.active || step.completed
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400 dark:text-gray-600'
                                        }`}>
                                        {step.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Products */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
                        <div className="space-y-4">
                            {order.order_details?.map((detail, index) => (
                                <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                                    {detail.product?.images?.[0] && (
                                        <img
                                            src={detail.product.images[0]}
                                            alt={detail.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80?text=Product';
                                            }}
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {detail.product?.name || 'Sản phẩm'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            SKU: {detail.product?.sku}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Số lượng: {detail.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-vintage-bronze dark:text-vintage-gold">
                                            {formatCurrency(detail.subtotal)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatCurrency(detail.unit_price)} × {detail.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</div>
                                    <div className="font-medium">{order.shipping_address}</div>
                                </div>
                            </div>
                            {order.user && (
                                <>
                                    <div className="flex items-start space-x-3">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</div>
                                            <div className="font-medium">{order.user.phone}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {order.notes && (
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ghi chú</div>
                                    <div className="text-sm">{order.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
                        <div className="space-y-3">
                            {order.payment && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Phương thức</span>
                                        <span className="font-medium">{order.payment.payment_method}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Trạng thái</span>
                                        <span className={`font-medium ${order.payment.payment_status === 'completed'
                                                ? 'text-green-600'
                                                : 'text-yellow-600'
                                            }`}>
                                            {order.payment.payment_status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tạm tính</span>
                                <span>{formatCurrency(order.total_amount - order.shipping_fee - order.tax + order.discount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển</span>
                                <span>{formatCurrency(order.shipping_fee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Thuế</span>
                                <span>{formatCurrency(order.tax)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Giảm giá</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-vintage-bronze dark:text-vintage-gold">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;


