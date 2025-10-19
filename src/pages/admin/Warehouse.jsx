import { useState, useEffect } from 'react';
import { warehouseService } from '../../services/warehouseService';
import {
    PlusIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    AdjustmentsHorizontalIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Warehouse = () => {
    const [logs, setLogs] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('logs'); // logs, low-stock, import, export
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // import, export, adjust

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [formData, setFormData] = useState({
        product_id: '',
        supplier_id: '',
        quantity: '',
        unit_price: '',
        new_quantity: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsRes, lowStockRes, statsRes] = await Promise.all([
                warehouseService.getAllLogs({ limit: 50 }),
                warehouseService.getLowStockProducts(10),
                warehouseService.getWarehouseStatistics()
            ]);
            setLogs(logsRes.data || []);
            setLowStockProducts(lowStockRes.data || []);
            setStatistics(statsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu kho');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('/suppliers');
            setSuppliers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        try {
            await warehouseService.importProducts({
                product_id: parseInt(formData.product_id),
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : undefined,
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price),
                notes: formData.notes
            });
            toast.success('Nhập kho thành công');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error importing:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleExport = async (e) => {
        e.preventDefault();
        try {
            await warehouseService.exportProducts({
                product_id: parseInt(formData.product_id),
                quantity: parseInt(formData.quantity),
                reference_type: 'manual',
                notes: formData.notes
            });
            toast.success('Xuất kho thành công');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error exporting:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleAdjust = async (e) => {
        e.preventDefault();
        try {
            await warehouseService.adjustStock({
                product_id: parseInt(formData.product_id),
                new_quantity: parseInt(formData.new_quantity),
                notes: formData.notes
            });
            toast.success('Điều chỉnh tồn kho thành công');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error adjusting:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            product_id: '',
            supplier_id: '',
            quantity: '',
            unit_price: '',
            new_quantity: '',
            notes: ''
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('vi-VN');
    };

    const getTypeColor = (type) => {
        const colors = {
            import: 'text-green-600 bg-green-100',
            export: 'text-red-600 bg-red-100',
            adjustment: 'text-blue-600 bg-blue-100'
        };
        return colors[type] || 'text-gray-600 bg-gray-100';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý Kho hàng
                </h1>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tổng sản phẩm</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {statistics.total_products}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Giá trị kho</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(statistics.total_stock_value)}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sắp hết hàng</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {statistics.low_stock_count}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hết hàng</p>
                        <p className="text-2xl font-bold text-red-600">
                            {statistics.out_of_stock_count}
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => openModal('import')}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Nhập kho
                </button>
                <button
                    onClick={() => openModal('export')}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    Xuất kho
                </button>
                <button
                    onClick={() => openModal('adjust')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    Điều chỉnh
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`py-2 border-b-2 font-medium text-sm ${activeTab === 'logs'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        Lịch sử
                    </button>
                    <button
                        onClick={() => setActiveTab('low-stock')}
                        className={`py-2 border-b-2 font-medium text-sm ${activeTab === 'low-stock'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        Sắp hết hàng ({lowStockProducts.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : activeTab === 'logs' ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Số lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Tồn kho
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Người thực hiện
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                        Thời gian
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(log.type)}`}>
                                                {log.type === 'import' ? 'Nhập' : log.type === 'export' ? 'Xuất' : 'Điều chỉnh'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {log.product?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${log.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {log.quantity > 0 ? '+' : ''}{log.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {log.quantity_before} → {log.quantity_after}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {log.creator?.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(log.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Sản phẩm sắp hết hàng
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {lowStockProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            SKU: {product.sku}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-red-600">
                                            {product.stock_quantity}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Còn lại
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

                        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <form onSubmit={modalType === 'import' ? handleImport : modalType === 'export' ? handleExport : handleAdjust}>
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {modalType === 'import' ? 'Nhập kho' : modalType === 'export' ? 'Xuất kho' : 'Điều chỉnh tồn kho'}
                                    </h3>
                                </div>

                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Sản phẩm *
                                        </label>
                                        <select
                                            required
                                            value={formData.product_id}
                                            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Chọn sản phẩm</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (Tồn: {p.stock_quantity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {modalType === 'import' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Nhà cung cấp
                                                </label>
                                                <select
                                                    value={formData.supplier_id}
                                                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Chọn nhà cung cấp</option>
                                                    {suppliers.map((s) => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.company_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Đơn giá nhập
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.unit_price}
                                                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {modalType !== 'adjust' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Số lượng *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tồn kho mới *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.new_quantity}
                                                onChange={(e) => setFormData({ ...formData, new_quantity: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 text-white rounded-lg transition-colors ${modalType === 'import' ? 'bg-green-600 hover:bg-green-700' :
                                            modalType === 'export' ? 'bg-red-600 hover:bg-red-700' :
                                                'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        Xác nhận
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

export default Warehouse;

