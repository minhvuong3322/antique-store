import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
    ShoppingBagIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, shipping, delivered, cancelled
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0
    });

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, filter, pagination.page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await orderService.getMyOrders(params);

            setOrders(response.data.orders || []);
            setPagination({
                ...pagination,
                total: response.data.pagination?.total || 0,
                total_pages: response.data.pagination?.total_pages || 0
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            await orderService.cancelOrder(orderId);
            toast.success('Đã hủy đơn hàng thành công');
            fetchOrders();
        } catch (error) {
            toast.error(error.message || 'Không thể hủy đơn hàng');
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                label: 'Chờ xác nhận',
                icon: ClockIcon,
                color: 'text-yellow-600 bg-yellow-50',
                borderColor: 'border-yellow-200'
            },
            confirmed: {
                label: 'Đã xác nhận',
                icon: CheckCircleIcon,
                color: 'text-blue-600 bg-blue-50',
                borderColor: 'border-blue-200'
            },
            shipping: {
                label: 'Đang giao hàng',
                icon: TruckIcon,
                color: 'text-purple-600 bg-purple-50',
                borderColor: 'border-purple-200'
            },
            delivered: {
                label: 'Đã giao hàng',
                icon: CheckCircleIcon,
                color: 'text-green-600 bg-green-50',
                borderColor: 'border-green-200'
            },
            cancelled: {
                label: 'Đã hủy',
                icon: XCircleIcon,
                color: 'text-red-600 bg-red-50',
                borderColor: 'border-red-200'
            }
        };
        return statusMap[status] || statusMap.pending;
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-bronze"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-vintage-bronze dark:text-vintage-gold mb-2">
                    Đơn hàng của tôi
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Theo dõi và quản lý các đơn hàng của bạn
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'pending', label: 'Chờ xác nhận' },
                    { value: 'confirmed', label: 'Đã xác nhận' },
                    { value: 'shipping', label: 'Đang giao' },
                    { value: 'delivered', label: 'Đã giao' },
                    { value: 'cancelled', label: 'Đã hủy' }
                ].map((filterOption) => (
                    <button
                        key={filterOption.value}
                        onClick={() => {
                            setFilter(filterOption.value);
                            setPagination({ ...pagination, page: 1 });
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === filterOption.value
                            ? 'bg-vintage-bronze text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {filterOption.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {filter === 'all'
                            ? 'Bạn chưa có đơn hàng nào'
                            : `Không có đơn hàng ${getStatusInfo(filter).label.toLowerCase()}`
                        }
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-vintage-bronze text-white px-6 py-3 rounded-lg hover:bg-vintage-bronze/90 transition-colors"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const StatusIcon = statusInfo.icon;

                        return (
                            <div
                                key={order.id}
                                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${statusInfo.borderColor}`}
                            >
                                {/* Order Header */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Mã đơn hàng
                                                </div>
                                                <div className="font-semibold text-vintage-bronze dark:text-vintage-gold">
                                                    #{order.order_number}
                                                </div>
                                            </div>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.color}`}>
                                                <StatusIcon className="w-5 h-5" />
                                                <span className="font-medium">
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Ngày đặt
                                            </div>
                                            <div className="font-medium">
                                                {formatDate(order.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Products */}
                                <div className="p-4">
                                    {order.order_details?.slice(0, 3).map((detail, index) => (
                                        <div key={index} className="flex items-center space-x-4 py-2">
                                            {detail.product?.images?.[0] && (
                                                <img
                                                    src={detail.product.images[0]}
                                                    alt={detail.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/64?text=Product';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {detail.product?.name || 'Sản phẩm'}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Số lượng: {detail.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-vintage-bronze dark:text-vintage-gold">
                                                    {formatCurrency(detail.subtotal)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {order.order_details?.length > 3 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            + {order.order_details.length - 3} sản phẩm khác
                                        </div>
                                    )}
                                </div>

                                {/* Order Footer */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="inline-flex items-center space-x-2 text-vintage-bronze dark:text-vintage-gold hover:underline"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                                <span>Xem chi tiết</span>
                                            </Link>

                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="inline-flex items-center space-x-2 text-red-600 hover:underline"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    <span>Hủy đơn</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Tổng tiền
                                            </div>
                                            <div className="text-xl font-bold text-vintage-bronze dark:text-vintage-gold">
                                                {formatCurrency(order.total_amount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2">
                            Trang {pagination.page} / {pagination.total_pages}
                        </span>
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            disabled={pagination.page >= pagination.total_pages}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;


