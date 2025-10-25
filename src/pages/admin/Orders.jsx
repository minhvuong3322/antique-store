import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { invoiceService } from '../../services/invoiceService';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    DocumentTextIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAllOrders(filters);
            setOrders(response.data?.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await orderService.getOrderById(orderId);
            setSelectedOrder(response.data?.order);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching order detail:', error);
            toast.error('Không thể tải chi tiết đơn hàng');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success('Cập nhật trạng thái thành công');
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                fetchOrderDetail(orderId);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error(error.message || 'Không thể cập nhật trạng thái');
        }
    };

    const handleCreateInvoice = async (orderId) => {
        try {
            await invoiceService.createInvoice({ order_id: orderId });
            toast.success('Tạo hóa đơn thành công');
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast.error(error.message || 'Không thể tạo hóa đơn');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
            delivered: { label: 'Đã giao', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
        };
        return badges[status] || badges.pending;
    };

    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý', color: 'yellow' },
        { value: 'confirmed', label: 'Xác nhận', color: 'blue' },
        { value: 'shipping', label: 'Đang giao', color: 'purple' },
        { value: 'delivered', label: 'Đã giao', color: 'green' },
        { value: 'cancelled', label: 'Hủy', color: 'red' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý Đơn hàng
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Tổng số: {orders.length} đơn hàng
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Mã đơn hàng, tên khách..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tất cả</option>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ search: '', status: '', page: 1, limit: 10 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Không có đơn hàng
                        </h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Mã đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {orders.map((order) => {
                                    const statusBadge = getStatusBadge(order.status);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    #{order.order_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {order.user?.full_name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {order.user?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(order.total_amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => fetchOrderDetail(order.id)}
                                                    className="text-primary-600 hover:text-primary-900 mr-3"
                                                    title="Xem chi tiết"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleCreateInvoice(order.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Tạo hóa đơn"
                                                    >
                                                        <DocumentTextIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>

                        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Chi tiết đơn hàng #{selectedOrder.order_number}
                                </h3>
                            </div>

                            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                                {/* Customer Info */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                        Thông tin khách hàng
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Tên:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {selectedOrder.user?.full_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {selectedOrder.user?.email}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">SĐT:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {selectedOrder.user?.phone || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 dark:text-gray-400">Địa chỉ giao hàng:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {selectedOrder.shipping_address}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                        Sản phẩm
                                    </h4>
                                    <div className="border dark:border-gray-600 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                                                        Sản phẩm
                                                    </th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
                                                        SL
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                                                        Đơn giá
                                                    </th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                                                        Thành tiền
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {selectedOrder.order_details?.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {item.product?.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                                                            {formatCurrency(item.unit_price)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                                                            {formatCurrency(item.subtotal)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển:</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {formatCurrency(selectedOrder.shipping_fee)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Giảm giá:</span>
                                            <span className="text-gray-900 dark:text-white">
                                                -{formatCurrency(selectedOrder.discount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Thuế:</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {formatCurrency(selectedOrder.tax)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                                            <span className="font-semibold text-gray-900 dark:text-white">Tổng cộng:</span>
                                            <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                                                {formatCurrency(selectedOrder.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Update Status */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                        Cập nhật trạng thái
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, opt.value)}
                                                disabled={selectedOrder.status === opt.value}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.status === opt.value
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600'
                                                    : `bg-${opt.color}-100 text-${opt.color}-800 hover:bg-${opt.color}-200 dark:bg-${opt.color}-900 dark:text-${opt.color}-200`
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedOrder.notes && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Ghi chú:</strong> {selectedOrder.notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;

