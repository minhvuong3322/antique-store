import { useState, useEffect } from 'react';
import { invoiceService } from '../../services/invoiceService';
import {
    MagnifyingGlassIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        payment_status: '',
        page: 1,
        limit: 10
    });

    const [createForm, setCreateForm] = useState({
        order_id: '',
        notes: ''
    });

    useEffect(() => {
        fetchInvoices();
    }, [filters]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoiceService.getAllInvoices(filters);
            setInvoices(response.data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Không thể tải danh sách hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const viewDetail = async (id) => {
        try {
            const response = await invoiceService.getInvoiceById(id);
            setSelectedInvoice(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            toast.error('Không thể tải chi tiết hóa đơn');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await invoiceService.createInvoice(createForm);
            toast.success('Tạo hóa đơn thành công');
            setShowCreateModal(false);
            setCreateForm({ order_id: '', notes: '' });
            fetchInvoices();
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast.error(error.response?.data?.message || 'Không thể tạo hóa đơn');
        }
    };

    const handleSendEmail = async (id) => {
        try {
            await invoiceService.sendInvoiceEmail(id);
            toast.success('Đã gửi hóa đơn qua email');
            fetchInvoices();
        } catch (error) {
            console.error('Error sending invoice:', error);
            toast.error('Không thể gửi email');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: { label: 'Đã thanh toán', class: 'bg-green-100 text-green-800' },
            unpaid: { label: 'Chưa thanh toán', class: 'bg-yellow-100 text-yellow-800' },
            partially_paid: { label: 'Thanh toán một phần', class: 'bg-blue-100 text-blue-800' },
            refunded: { label: 'Đã hoàn tiền', class: 'bg-red-100 text-red-800' }
        };
        return badges[status] || badges.unpaid;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý Hóa đơn
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Tổng số: {invoices.length} hóa đơn
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Tạo hóa đơn
                </button>
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
                                placeholder="Số hóa đơn, email..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Trạng thái thanh toán
                        </label>
                        <select
                            value={filters.payment_status}
                            onChange={(e) => setFilters({ ...filters, payment_status: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tất cả</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                            <option value="partially_paid">Thanh toán một phần</option>
                            <option value="refunded">Đã hoàn tiền</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ search: '', payment_status: '', page: 1, limit: 10 })}
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
                ) : invoices.length === 0 ? (
                    <div className="text-center py-12">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Chưa có hóa đơn
                        </h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Số hóa đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Đơn hàng
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
                                        Ngày xuất
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {invoices.map((invoice) => {
                                    const statusBadge = getStatusBadge(invoice.payment_status);
                                    return (
                                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                                                    {invoice.invoice_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    #{invoice.order?.order_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {invoice.customer_name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {invoice.customer_email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(invoice.total_amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(invoice.invoice_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => viewDetail(invoice.id)}
                                                    className="text-primary-600 hover:text-primary-900 mr-3"
                                                    title="Xem chi tiết"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                {!invoice.sent_to_email && (
                                                    <button
                                                        onClick={() => handleSendEmail(invoice.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Gửi email"
                                                    >
                                                        <PaperAirplaneIcon className="h-5 w-5" />
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
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>

                        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Hóa đơn {selectedInvoice.invoice_number}
                                </h3>
                            </div>

                            <div className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {selectedInvoice.customer_name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedInvoice.customer_email}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedInvoice.customer_phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ngày xuất</p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedInvoice.invoice_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Tổng tiền hàng:</span>
                                            <span className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí vận chuyển:</span>
                                            <span className="font-medium">{formatCurrency(selectedInvoice.shipping_fee)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Thuế:</span>
                                            <span className="font-medium">{formatCurrency(selectedInvoice.tax)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Giảm giá:</span>
                                            <span className="font-medium text-red-600">-{formatCurrency(selectedInvoice.discount)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                                            <span className="font-semibold">Tổng cộng:</span>
                                            <span className="font-bold text-lg text-primary-600">
                                                {formatCurrency(selectedInvoice.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedInvoice.notes && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Ghi chú:</strong> {selectedInvoice.notes}
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

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>

                        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <form onSubmit={handleCreate}>
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Tạo hóa đơn mới
                                    </h3>
                                </div>

                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Order ID *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={createForm.order_id}
                                            onChange={(e) => setCreateForm({ ...createForm, order_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={createForm.notes}
                                            onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                    >
                                        Tạo hóa đơn
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;

