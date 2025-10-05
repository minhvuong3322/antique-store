import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Grid, List, Loader2 } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'

const ProductsPage = () => {
    const { t } = useTranslation()
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceRange, setPriceRange] = useState([0, 100000000])
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch products and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch both products and categories
                const [productsResponse, categoriesResponse] = await Promise.all([
                    productService.getProducts(),
                    categoryService.getCategories()
                ])

                if (productsResponse.success) {
                    setProducts(productsResponse.data.products || [])
                }

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data.categories || [])
                }
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Không thể tải dữ liệu')
                setProducts([])
                setCategories([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filter products
    const filteredProducts = products.filter(product => {
        // Category filter - compare as numbers
        const productCategoryId = product.category?.id || product.category_id
        if (selectedCategory !== 'all' && Number(productCategoryId) !== Number(selectedCategory)) {
            return false
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
            return false
        }
        return true
    })

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-elegant text-4xl md:text-5xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                        {t('nav.products')}
                    </h1>
                    <p className="text-vintage-wood dark:text-vintage-lightwood font-serif">
                        Khám phá {filteredProducts.length} sản phẩm độc đáo
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="card-vintage p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-serif text-lg font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                    <Filter className="inline-block w-5 h-5 mr-2" />
                                    {t('common.filter')}
                                </h3>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-3">
                                    Danh Mục
                                </h4>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="all"
                                            checked={selectedCategory === 'all'}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="text-vintage-gold"
                                        />
                                        <span className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                            Tất cả
                                        </span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                checked={Number(selectedCategory) === Number(cat.id)}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="text-vintage-gold"
                                            />
                                            <span className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                {cat.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range - Simplified */}
                            <div className="mb-6">
                                <h4 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-3">
                                    Khoảng Giá
                                </h4>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Tất cả', range: [0, 100000000] },
                                        { label: 'Dưới 20 triệu', range: [0, 20000000] },
                                        { label: '20-40 triệu', range: [20000000, 40000000] },
                                        { label: '40-60 triệu', range: [40000000, 60000000] },
                                        { label: 'Trên 60 triệu', range: [60000000, 100000000] },
                                    ].map((option, idx) => (
                                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                checked={priceRange[0] === option.range[0] && priceRange[1] === option.range[1]}
                                                onChange={() => setPriceRange(option.range)}
                                                className="text-vintage-gold"
                                            />
                                            <span className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-vintage-wood dark:text-vintage-lightwood">
                                Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md ${viewMode === 'grid'
                                        ? 'bg-vintage-gold text-vintage-darkwood'
                                        : 'bg-vintage-gold/10 text-vintage-wood'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md ${viewMode === 'list'
                                        ? 'bg-vintage-gold text-vintage-darkwood'
                                        : 'bg-vintage-gold/10 text-vintage-wood'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Products */}
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-vintage-gold mx-auto mb-4" />
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">Đang tải sản phẩm...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-vintage-wood dark:text-vintage-lightwood text-lg mb-4">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn-vintage"
                                >
                                    Thử lại
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                        : 'space-y-6'
                                }>
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-vintage-wood dark:text-vintage-lightwood text-lg">
                                            Không tìm thấy sản phẩm phù hợp
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage


