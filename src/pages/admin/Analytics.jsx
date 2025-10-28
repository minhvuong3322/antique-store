import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        fetchRevenueData();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [analyticsRes, topProductsRes, ordersRes] = await Promise.all([
                adminService.getComprehensiveAnalytics(),
                adminService.getTopProducts(10),
                adminService.getOrdersByStatus()
            ]);
            setAnalytics(analyticsRes.data);
            setTopProducts(topProductsRes.data || []);
            setOrdersByStatus(ordersRes.data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await adminService.getRevenueStatistics(period);
            setRevenueData(response.data || []);
        } catch (error) {
            console.error('Error fetching revenue:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Chờ xử lý',
            confirmed: 'Đã xác nhận',
            shipping: 'Đang giao',
            delivered: 'Đã giao',
            cancelled: 'Đã hủy'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statCards = analytics ? [
        {
            name: 'Tổng doanh thu',
            value: formatCurrency(analytics.overview.total_revenue),
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
            trend: '+12.5%',
            trendUp: true
        },
        {
            name: 'Tổng đơn hàng',
            value: formatNumber(analytics.overview.total_orders),
            icon: ShoppingCartIcon,
            color: 'bg-blue-500',
            trend: '+8.2%',
            trendUp: true
        },
        {
            name: 'Khách hàng',
            value: formatNumber(analytics.overview.total_users),
            icon: UserGroupIcon,
            color: 'bg-purple-500',
            trend: '+15.3%',
            trendUp: true
        }
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Thống kê & Phân tích
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Tổng quan hiệu suất kinh doanh
                    </p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="day">Theo ngày</option>
                    <option value="week">Theo tuần</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                </select>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} rounded-lg p-3`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trendUp ? (
                                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                                    )}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Doanh thu theo {period === 'day' ? 'ngày' : period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'}
                    </h2>
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-4">
                    {revenueData.length > 0 ? (
                        <>
                            {/* Simple bar chart representation */}
                            <div className="space-y-3">
                                {revenueData.slice(0, 12).map((item, index) => {
                                    const maxRevenue = Math.max(...revenueData.map(d => parseFloat(d.total_revenue)));
                                    const percentage = (parseFloat(item.total_revenue) / maxRevenue) * 100;

                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.period}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(item.total_revenue)}
                                                    <span className="text-gray-500 ml-2">({item.order_count} đơn)</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            Chưa có dữ liệu doanh thu
                        </p>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Sản phẩm bán chạy
                    </h2>
                    <div className="space-y-4">
                        {topProducts.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {item.product?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Đã bán: {item.total_sold}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.total_revenue)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Đơn hàng theo trạng thái
                    </h2>
                    <div className="space-y-4">
                        {ordersByStatus.map((item, index) => {
                            const total = ordersByStatus.reduce((sum, o) => sum + parseInt(o.count), 0);
                            const percentage = total > 0 ? (parseInt(item.count) / total) * 100 : 0;

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.count} đơn ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Additional Statistics */}
            {analytics && analytics.warehouse && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Warehouse Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                            Kho hàng
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Sắp hết hàng:</span>
                                <span className="text-sm font-medium text-yellow-600">
                                    {analytics.warehouse.low_stock_count || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Hết hàng:</span>
                                <span className="text-sm font-medium text-red-600">
                                    {analytics.warehouse.out_of_stock_count || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;

