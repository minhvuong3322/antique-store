import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        sale_price: '',
        stock_quantity: '',
        sku: '',
        condition: 'excellent',
        origin: '',
        year_manufactured: '',
        material: '',
        dimensions: '',
        weight: '',
        is_featured: false,
        is_active: true
    });

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        is_featured: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts(filters);
            setProducts(response.data?.products || []);
            setTotalPages(response.data.pagination?.total_pages || 1);
            setTotalItems(response.data.pagination?.total || 0);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data?.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await productService.createProduct(formData);
                toast.success('Thêm sản phẩm thành công');
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category_id: product.category_id,
            description: product.description || '',
            price: product.price,
            sale_price: product.sale_price || null,
            stock_quantity: product.stock_quantity,
            sku: product.sku || '',
            condition: product.condition || 'excellent',
            origin: product.origin || '',
            year_manufactured: product.year_manufactured || '',
            material: product.material || '',
            dimensions: product.dimensions || '',
            weight: product.weight || null,
            is_featured: product.is_featured,
            is_active: product.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            await productService.deleteProduct(id);
            toast.success('Xóa sản phẩm thành công');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.message || 'Không thể xóa sản phẩm');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category_id: '',
            description: '',
            price: '',
            sale_price: '',
            stock_quantity: '',
            sku: '',
            condition: 'excellent',
            origin: '',
            year_manufactured: '',
            material: '',
            dimensions: '',
            weight: '',
            is_featured: false,
            is_active: true
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const getConditionBadge = (condition) => {
        const badges = {
            excellent: { label: 'Xuất sắc', class: 'bg-green-100 text-green-800' },
            good: { label: 'Tốt', class: 'bg-blue-100 text-blue-800' },
            fair: { label: 'Khá', class: 'bg-yellow-100 text-yellow-800' },
            poor: { label: 'Trung bình', class: 'bg-gray-100 text-gray-800' }
        };
        return badges[condition] || badges.good;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quản lý Sản phẩm
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Tổng số: {products.length} sản phẩm
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tên, SKU..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Danh mục
                        </label>
                        <select
                            value={filters.category_id}
                            onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tất cả</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nổi bật
                        </label>
                        <select
                            value={filters.is_featured}
                            onChange={(e) => setFilters({ ...filters, is_featured: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Tất cả</option>
                            <option value="true">Nổi bật</option>
                            <option value="false">Không nổi bật</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ search: '', category_id: '', is_featured: '', page: 1, limit: 10 })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FunnelIcon className="h-5 w-5 inline mr-2" />
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
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Không có sản phẩm
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Bắt đầu bằng cách tạo sản phẩm mới
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tồn kho
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tình trạng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((product) => {
                                    const conditionBadge = getConditionBadge(product.condition);
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {product.images && product.images[0] ? (
                                                            <img
                                                                className="h-10 w-10 rounded object-cover"
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            SKU: {product.sku || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {product.category?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatCurrency(product.price)}
                                                </div>
                                                {product.sale_price && (
                                                    <div className="text-sm text-red-600">
                                                        {formatCurrency(product.sale_price)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${product.stock_quantity <= 10
                                                    ? 'text-red-600'
                                                    : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${conditionBadge.class}`}>
                                                    {conditionBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-primary-600 hover:text-primary-900 mr-3"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                {/* Pagination */}
                {!loading && products.length > 0 && (
                    <div className="flex flex-col items-center justify-center px-6 py-4 bg-gray-50 dark:bg-gray-700 space-y-3">
                        {/* Thông tin tổng quan */}
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Trang {filters.page} / {totalPages} — Tổng {totalItems} sản phẩm
                        </p>

                        {/* Thanh phân trang */}
                        <div className="flex space-x-2 items-center">
                            {/* Nút Trang trước */}
                            <button
                                disabled={filters.page <= 1}
                                onClick={() =>
                                    setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                                }
                                className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 ${
                                    filters.page <= 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Trang trước
                            </button>

                            {/* Danh sách số trang */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                                        className={`px-3 py-1 rounded-lg border ${
                                            filters.page === pageNum
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Nút Trang sau */}
                            <button
                                disabled={filters.page >= totalPages}
                                onClick={() =>
                                    setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                                }
                                className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 ${
                                    filters.page >= totalPages
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                )}


                    </div>
                )}
                
            </div>
            

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

                        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                                    </h3>
                                </div>

                                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tên sản phẩm *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Danh mục *
                                            </label>
                                            <select
                                                required
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Giá *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Giá khuyến mãi
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.sale_price}
                                                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tồn kho *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.stock_quantity}
                                                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                SKU
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tình trạng
                                            </label>
                                            <select
                                                value={formData.condition}
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="excellent">Xuất sắc</option>
                                                <option value="good">Tốt</option>
                                                <option value="fair">Khá</option>
                                                <option value="poor">Trung bình</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Xuất xứ
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.origin}
                                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Năm sản xuất
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.year_manufactured}
                                                onChange={(e) => setFormData({ ...formData, year_manufactured: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Chất liệu
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.material}
                                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Kích thước
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="DxRxC"
                                                value={formData.dimensions}
                                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Trọng lượng (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.weight}
                                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Mô tả
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_featured}
                                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                                Sản phẩm nổi bật
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                                                Hoạt động
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                    >
                                        {editingProduct ? 'Cập nhật' : 'Thêm mới'}
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

export default Products;

