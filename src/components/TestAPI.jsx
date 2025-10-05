import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

function TestAPI() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getFeaturedProducts(6);

            if (response.success) {
                setProducts(response.data.products);
            }
        } catch (err) {
            setError(err.message || 'Lỗi khi tải sản phẩm');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const response = await cartService.addToCart(productId, 1);
            if (response.success) {
                alert('Đã thêm vào giỏ hàng!');
            }
        } catch (err) {
            alert(err.message || 'Vui lòng đăng nhập để thêm vào giỏ hàng');
        }
    };

    if (loading) return <div className="p-4">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                        <img
                            src={product.images?.[0] || 'https://via.placeholder.com/300'}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded mb-3"
                        />
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <div>
                                {product.sale_price ? (
                                    <>
                                        <span className="text-red-600 font-bold">
                                            {product.sale_price.toLocaleString()} VND
                                        </span>
                                        <span className="text-gray-400 line-through ml-2 text-sm">
                                            {product.price.toLocaleString()} VND
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-bold">
                                        {product.price.toLocaleString()} VND
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleAddToCart(product.id)}
                            className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Thêm vào giỏ
                        </button>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                    Chưa có sản phẩm nào
                </p>
            )}
        </div>
    );
}

export default TestAPI;



