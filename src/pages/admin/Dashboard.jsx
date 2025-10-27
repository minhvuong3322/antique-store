import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    UserGroupIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    // Redirect staff to products page
    if (user?.role === 'staff') {
        return <Navigate to="/admin/products" replace />;
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [overviewRes, activitiesRes, topProductsRes] = await Promise.all([
                api.get('/admin/dashboard/overview'),
                api.get('/admin/dashboard/recent-activities'),
                api.get('/admin/dashboard/top-products?limit=5')
            ]);

            setOverview(overviewRes.data);
            setRecentOrders(activitiesRes.data.recent_orders || []);
            setTopProducts(topProductsRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = overview ? [
        {
            name: 'Tổng khách hàng',
            value: overview.total_users,
            icon: UserGroupIcon,
            change: '+12%',
            changeType: 'positive',
            color: 'bg-blue-500'
        },
        {
            name: 'Tổng sản phẩm',
            value: overview.total_products,
            icon: ShoppingBagIcon,
            change: '+4%',
            changeType: 'positive',
            color: 'bg-green-500'
        },
        {
            name: 'Đơn hàng tháng này',
            value: overview.this_month_orders,
            icon: ShoppingCartIcon,
            change: `${overview.pending_orders} đang chờ`,
            changeType: 'neutral',
            color: 'bg-yellow-500'
        },
        {
            name: 'Doanh thu',
            value: `${parseFloat(overview.total_revenue).toLocaleString('vi-VN')} ₫`,
            icon: CurrencyDollarIcon,
            change: `${parseFloat(overview.this_month_revenue).toLocaleString('vi-VN')} ₫ tháng này`,
            changeType: 'positive',
            color: 'bg-purple-500'
        }
    ] : [];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            shipping: { label: 'Đang giao', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
            delivered: { label: 'Đã giao', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Tổng quan hệ thống Antique Store
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="relative bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {stat.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                                <div className="text-sm">
                                    <span className={`flex items-center ${stat.changeType === 'positive' ? 'text-green-600' :
                                        stat.changeType === 'negative' ? 'text-red-600' :
                                            'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {stat.changeType === 'positive' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
                                        {stat.changeType === 'negative' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Alerts */}
            {overview && overview.low_stock_products > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Có <span className="font-semibold">{overview.low_stock_products}</span> sản phẩm sắp hết hàng.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Two column layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent orders */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            Đơn hàng gần đây
                        </h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                                {recentOrders.slice(0, 5).map((order) => {
                                    const statusInfo = getStatusBadge(order.status);
                                    return (
                                        <li key={order.id} className="py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        Đơn hàng #{order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {order.user?.full_name || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(order.total_amount)}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/admin/orders"
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Xem tất cả đơn hàng
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Top products */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            Sản phẩm bán chạy
                        </h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                                {topProducts.map((item, index) => (
                                    <li key={item.product_id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-semibold">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Đã bán: {item.total_sold}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(item.total_revenue)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/admin/products"
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Quản lý sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                    to="/admin/orders?status=pending"
                    className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Đơn hàng chờ xử lý
                    </h4>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {overview?.pending_orders || 0}
                    </p>
                </Link>

                <Link
                    to="/admin/warranties?status=claimed"
                    className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Yêu cầu bảo hành
                    </h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        -
                    </p>
                </Link>

                <Link
                    to="/admin/analytics"
                    className="relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Xem thống kê
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Báo cáo chi tiết →
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;

