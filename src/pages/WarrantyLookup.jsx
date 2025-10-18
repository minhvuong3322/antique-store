import { useState } from 'react';
import { warrantyService } from '../services/warrantyService';
import { MagnifyingGlassIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const WarrantyLookup = () => {
    const [warrantyCode, setWarrantyCode] = useState('');
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!warrantyCode.trim()) {
            toast.error('Vui lòng nhập mã bảo hành');
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            const response = await warrantyService.getWarrantyByCode(warrantyCode.trim());
            setWarranty(response.data);
        } catch (error) {
            console.error('Error searching warranty:', error);
            setWarranty(null);
            if (error.response?.status === 404) {
                toast.error('Không tìm thấy mã bảo hành');
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            active: {
                label: 'Đang hoạt động',
                description: 'Bảo hành của bạn đang còn hiệu lực',
                icon: CheckCircleIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-900/20',
                borderColor: 'border-green-200'
            },
            claimed: {
                label: 'Đã yêu cầu bảo hành',
                description: 'Yêu cầu bảo hành của bạn đã được ghi nhận',
                icon: CheckCircleIcon,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                borderColor: 'border-yellow-200'
            },
            processing: {
                label: 'Đang xử lý',
                description: 'Chúng tôi đang xử lý yêu cầu bảo hành của bạn',
                icon: CheckCircleIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                borderColor: 'border-blue-200'
            },
            completed: {
                label: 'Hoàn thành',
                description: 'Bảo hành đã được hoàn thành',
                icon: CheckCircleIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                borderColor: 'border-purple-200'
            },
            expired: {
                label: 'Hết hạn',
                description: 'Bảo hành đã hết hiệu lực',
                icon: XCircleIcon,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50 dark:bg-gray-900/20',
                borderColor: 'border-gray-200'
            },
            cancelled: {
                label: 'Đã hủy',
                description: 'Bảo hành đã bị hủy',
                icon: XCircleIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50 dark:bg-red-900/20',
                borderColor: 'border-red-200'
            }
        };
        return statusMap[status] || statusMap.active;
    };

    const statusInfo = warranty ? getStatusInfo(warranty.status) : null;
    const StatusIcon = statusInfo?.icon;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <ShieldCheckIcon className="mx-auto h-16 w-16 text-primary-600 dark:text-primary-400" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Tra cứu Bảo hành
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Nhập mã bảo hành để kiểm tra tình trạng
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nhập mã bảo hành (VD: WR-ORD001-1-1234567890)"
                                    value={warrantyCode}
                                    onChange={(e) => setWarrantyCode(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang tìm...' : 'Tra cứu'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : searched && warranty ? (
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className={`${statusInfo.bgColor} border ${statusInfo.borderColor} dark:border-gray-600 rounded-lg p-6`}>
                            <div className="flex items-start">
                                <StatusIcon className={`h-8 w-8 ${statusInfo.color} mr-4 flex-shrink-0`} />
                                <div className="flex-1">
                                    <h3 className={`text-xl font-semibold ${statusInfo.color} mb-1`}>
                                        {statusInfo.label}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {statusInfo.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warranty Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
                                <h2 className="text-xl font-bold text-white">
                                    Thông tin Bảo hành
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Mã bảo hành
                                        </p>
                                        <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
                                            {warranty.warranty_code}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Mã đơn hàng
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            #{warranty.order?.order_number}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Sản phẩm
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {warranty.product?.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Ngày bắt đầu bảo hành
                                        </p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatDate(warranty.warranty_date)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Ngày hết hạn
                                        </p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatDate(warranty.expiry_date)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Thời gian bảo hành
                                        </p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {warranty.warranty_period} tháng
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Khách hàng
                                        </p>
                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                            {warranty.order?.user?.full_name}
                                        </p>
                                    </div>
                                </div>

                                {warranty.issue_description && (
                                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Vấn đề đã báo:
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {warranty.issue_description}
                                        </p>
                                    </div>
                                )}

                                {warranty.admin_notes && (
                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Ghi chú từ hệ thống:
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {warranty.admin_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Help Info */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                📞 Cần hỗ trợ?
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Nếu bạn có thắc mắc về bảo hành, vui lòng liên hệ:
                                <br />
                                - Hotline: 1900-xxxx
                                <br />
                                - Email: support@antiquestore.com
                            </p>
                        </div>
                    </div>
                ) : searched && !warranty ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                        <XCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            Không tìm thấy
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Mã bảo hành không tồn tại hoặc không hợp lệ.
                            <br />
                            Vui lòng kiểm tra lại mã bảo hành.
                        </p>
                    </div>
                ) : null}

                {/* Instructions */}
                {!searched && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Hướng dẫn tra cứu
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex">
                                <span className="font-semibold text-primary-600 mr-2">1.</span>
                                <p>Tìm mã bảo hành trong email xác nhận đơn hàng hoặc trên phiếu bảo hành</p>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-primary-600 mr-2">2.</span>
                                <p>Nhập đầy đủ mã bảo hành vào ô tìm kiếm ở trên</p>
                            </div>
                            <div className="flex">
                                <span className="font-semibold text-primary-600 mr-2">3.</span>
                                <p>Nhấn nút "Tra cứu" để xem thông tin chi tiết</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WarrantyLookup;

