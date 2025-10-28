import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    HomeIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch new orders count
    useEffect(() => {
        const fetchNewOrdersCount = async () => {
            try {
                const response = await api.get('/admin/orders/new-count');
                if (response.data.success) {
                    setNewOrdersCount(response.data.data.count);
                }
            } catch (error) {
                console.error('Error fetching new orders count:', error);
            }
        };

        fetchNewOrdersCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNewOrdersCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation items - filtered by role
    const allNavigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, roles: ['admin'] },
        { name: 'Sản phẩm', href: '/admin/products', icon: ShoppingBagIcon, roles: ['admin', 'staff'] },
        { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCartIcon, badge: newOrdersCount, roles: ['admin', 'staff'] },
        { name: 'Nhân viên', href: '/admin/users', icon: UserGroupIcon, roles: ['admin'] },
        { name: 'Tin nhắn hỗ trợ', href: '/admin/support', icon: ChatBubbleLeftRightIcon, roles: ['admin', 'staff'] },
        { name: 'Thống kê', href: '/admin/analytics', icon: ChartBarIcon, roles: ['admin'] },
    ];

    // Filter navigation based on user role
    const navigation = allNavigation.filter(item => item.roles.includes(user?.role || 'customer'));

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar for mobile */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="flex items-center">
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </span>
                                {item.badge > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Antique Store</h1>
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="flex items-center">
                                        <Icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </span>
                                    {item.badge > 0 && (
                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info & logout */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center mb-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                    {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.full_name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1 items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
                            </h2>
                        </div>
                        <div className="ml-4 flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Xin chào, <span className="font-semibold">{user?.full_name}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

