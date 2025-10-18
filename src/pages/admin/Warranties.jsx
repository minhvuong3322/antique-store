import { useState, useEffect } from 'react';
import { warrantyService } from '../../services/warrantyService';
import {
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Warranties = () => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1,
        limit: 10
    });

    const [createForm, setCreateForm] = useState({
        order_id: '',
        product_id: '',
        warranty_period: 12
    });

    useEffect(() => {
        fetchWarranties();
    }, [filters]);

    const fetchWarranties = async () => {
        try {
            setLoading(true);
            const response = await warrantyService.getAllWarranties(filters);
            setWarranties(response.data || []);
        } catch (error) {
            console.error('Error fetching warranties:', error);
            toast.error('Không thể tải danh sách bảo hành');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await warrantyService.createWarranty(createForm);
            toast.success('Tạo bảo hành thành công');
            setShowCreateModal(false);
            setCreateForm({ order_id: '', product_id: '', warranty_period: 12 });
            fetchWarranties();
        } catch (error) {
            console.error('Error creating warranty:', error);
            toast.error(error.response?.data?.message || 'Không thể tạo bảo hành');
        }
    };

    const handleUpdateStatus = async (id, newStatus, adminNotes = '') => {
        try {
            await warrantyService.updateWarranty(id, { status: newStatus, admin_notes: adminNotes });
            toast.success('Cập nhật trạng thái thành công');
            fetchWarranties();
            if (selectedWarranty?.id === id) {
                const response = await warrantyService.getWarrantyById(id);
                setSelectedWarranty(response.data);
            }
        } catch (error) {
            console.error('Error updating warranty:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const viewDetail = async (id) => {
        try {
            const response = await warrantyService.getWarrantyById(id);
            setSelectedWarranty(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching warranty detail:', error);
            toast.error('Không thể tải chi tiết bảo hành');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: { label: 'Đang hoạt động', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            claimed: { label: 'Đã yêu cầu', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            completed: { label: 'Hoàn thành', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
            expired: { label: 'Hết hạn', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
        };
        return badges[status] || badges.active;
    };

    const statusOptions = [
        { value: 'claimed', label: 'Đã yêu cầu' },
        { value: 'processing', label: 'Đang xử lý' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Hủy' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý Bảo hành
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Tổng số: {warranties.length} bảo hành
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Tạo bảo hành
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
                                placeholder="Mã bảo hành..."
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
                            <option value="active">Đang hoạt động</option>
                            <option value="claimed">Đã yêu cầu</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="expired">Hết hạn</option>
                            <option value="cancelled">Đã hủy</option>
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
                ) : warranties.length === 0 ? (
                    <div className="text-center py-12">
                        <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Không có bảo hành
                        </h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Mã bảo hành
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Hết hạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {warranties.map((warranty) => {
                                    const statusBadge = getStatusBadge(warranty.status);
                                    return (
                                        <tr key={warranty.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900 dark:text-white">
                                                    {warranty.warranty_code}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    #{warranty.order?.order_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {warranty.product?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(warranty.expiry_date)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ({warranty.warranty_period} tháng)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => viewDetail(warranty.id)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                    title="Xem chi tiết"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
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
            {showDetailModal && selectedWarranty && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>

                        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Chi tiết Bảo hành
                                </h3>
                            </div>

                            <div className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mã bảo hành</p>
                                        <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                                            {selectedWarranty.warranty_code}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Đơn hàng</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            #{selectedWarranty.order?.order_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Sản phẩm</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {selectedWarranty.product?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {selectedWarranty.order?.user?.full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ngày bắt đầu</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedWarranty.warranty_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ngày hết hạn</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedWarranty.expiry_date)}
                                        </p>
                                    </div>
                                </div>

                                {selectedWarranty.issue_description && (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            Mô tả vấn đề:
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {selectedWarranty.issue_description}
                                        </p>
                                    </div>
                                )}

                                {selectedWarranty.admin_notes && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            Ghi chú admin:
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {selectedWarranty.admin_notes}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Cập nhật trạng thái:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    const notes = opt.value === 'completed'
                                                        ? prompt('Nhập ghi chú (nếu có):') || ''
                                                        : '';
                                                    handleUpdateStatus(selectedWarranty.id, opt.value, notes);
                                                }}
                                                disabled={selectedWarranty.status === opt.value}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedWarranty.status === opt.value
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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
                                        Tạo bảo hành mới
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
                                            Product ID *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={createForm.product_id}
                                            onChange={(e) => setCreateForm({ ...createForm, product_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Thời gian bảo hành (tháng)
                                        </label>
                                        <input
                                            type="number"
                                            value={createForm.warranty_period}
                                            onChange={(e) => setCreateForm({ ...createForm, warranty_period: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        />
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
                                        Tạo bảo hành
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

export default Warranties;

