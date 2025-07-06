import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../../api/axiosInstance';
import ProductAddModal from './ProductAddModal';
import ProductViewModal from './ProductViewModal';

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedVariants, setExpandedVariants] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products', {
        params: { sortBy, sortOrder },
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch products when sortBy or sortOrder changes
  useEffect(() => {
    if (products.length > 0) {
      fetchProducts();
    }
  }, [sortBy, sortOrder]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  const handleAddProduct = () => {
    fetchProducts();
    setIsAddModalOpen(false);
  };

  const toggleVariantExpansion = (productId) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDisplayBadges = (displayOptions) => {
    const badges = [];
    if (displayOptions?.includes('trending')) badges.push({ label: 'Trending' });
    if (displayOptions?.includes('newArrival')) badges.push({ label: 'New' });
    if (displayOptions?.includes('showOnHome')) badges.push({ label: 'Featured' });
    if (displayOptions?.includes('mostSelling')) badges.push({ label: 'Best Seller' });
    return badges;
  };

  const getProductTypeBadges = (productTypes) => {
    const badges = [];
    if (productTypes?.includes('organic')) badges.push({ label: 'Organic' });
    if (productTypes?.includes('sulfateFree')) badges.push({ label: 'Sulfate-Free' });
    if (productTypes?.includes('parabenFree')) badges.push({ label: 'Paraben-Free' });
    if (productTypes?.includes('vegan')) badges.push({ label: 'Vegan' });
    return badges;
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category?._id === selectedCategory);
    }
    // Sorting is handled by the backend, so no client-side sorting is needed
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const ProductCard = ({ product }) => {
    const discountPercentage = product.variants?.length
      ? Math.max(
          ...product.variants.map((v) => Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100))
        )
      : 0;

    const totalStock = product.variants?.length
      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : 0;

    const priceRange = product.variants?.length
      ? `${formatPrice(Math.min(...product.variants.map((v) => v.sellingPrice)))} - ${formatPrice(
          Math.max(...product.variants.map((v) => v.sellingPrice))
        )}`
      : 'N/A';

    return (
      <div className="bg-white border border-gray-300 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
              totalStock > 0 ? 'bg-gray-200 text-black' : 'bg-red-200 text-red-800'
            }`}
          >
            {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsViewModalOpen(true);
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
              aria-label="View product"
            >
              <Eye className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsEditModalOpen(true);
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
              aria-label="Edit product"
            >
              <Edit className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {getDisplayBadges(product.displayOptions || []).map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-gray-200 text-black"
              >
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-black mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.category?.title || 'Uncategorized'}</p>
          <div className="mb-3">
            <div className="text-xl font-bold text-black">{priceRange}</div>
          </div>
          {product.variants?.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => toggleVariantExpansion(product._id)}
                className="flex items-center justify-between w-full text-sm font-medium text-black hover:text-gray-700"
              >
                <span>View Variants ({product.variants.length})</span>
                {expandedVariants[product._id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {expandedVariants[product._id] && (
                <div className="mt-2 space-y-2">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <div>
                        <span className="font-medium">
                          {variant.volume}
                          {variant.volumeUnit}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">Stock: {variant.stock}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatPrice(variant.sellingPrice)}</div>
                        {variant.mrp !== variant.sellingPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(variant.mrp)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-1 mb-3">
            {getProductTypeBadges(product.productTypes || []).map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-black"
              >
                {badge.label}
              </span>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{product.targetAudience || 'All'}</span>
          </div>
        </div>
      </div>
    );
  };

  const TableRow = ({ product }) => {
    const totalStock = product.variants?.length
      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : 0;

    const priceRange = product.variants?.length
      ? `${formatPrice(Math.min(...product.variants.map((v) => v.sellingPrice)))} - ${formatPrice(
          Math.max(...product.variants.map((v) => v.sellingPrice))
        )}`
      : 'N/A';

    return (
      <tr className="hover:bg-gray-100 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/50'}
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div>
              <div className="font-medium text-black">{product.name}</div>
              <div className="text-sm text-gray-600">{product.category?.title || 'Uncategorized'}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {getDisplayBadges(product.displayOptions || []).slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-black"
              >
                {badge.label}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="font-semibold">{priceRange}</div>
          {product.variants?.length > 0 && (
            <div className="text-xs text-gray-600">{product.variants.length} variants</div>
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              totalStock > 0 ? 'bg-gray-200 text-black' : 'bg-red-200 text-red-800'
            }`}
          >
            {totalStock}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {getProductTypeBadges(product.productTypes || []).slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-black"
              >
                {badge.label}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsViewModalOpen(true);
              }}
              className="p-2 text-black hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="View product"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedProduct(product);
                setIsEditModalOpen(true);
              }}
              className="p-2 text-black hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Edit product"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="p-2 text-black hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Product Management</h1>
            <p className="text-sm text-gray-600">{products.length} products found</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset to first page on sort change
              }}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="createdAt">Sort by Date</option>
            </select>
            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                setCurrentPage(1); // Reset to first page on order change
              }}
              className="border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors"
              aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortBy === 'createdAt'
                ? sortOrder === 'asc'
                  ? 'Oldest'
                  : 'Latest'
                : sortOrder === 'asc'
                ? '↑'
                : '↓'}
            </button>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600 text-lg">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden mb-6">
              <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Display</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <TableRow key={product._id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Product</span>
              </button>
            </div>
          )}

          {filteredProducts.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg border border-gray-300">
              <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                <span className="text-gray-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
                <span className="text-gray-600">per page</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-gray-500 text-white border-gray-500'
                          : 'border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredProducts.length)} of{' '}
                {filteredProducts.length} products
              </div>
            </div>
          )}
        </>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-screen-2xl">
            <ProductAddModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddProduct} />
          </div>
        </div>
      )}

      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-screen-2xl">
            <ProductViewModal product={selectedProduct} onClose={() => setIsViewModalOpen(false)} />
          </div>
        </div>
      )}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-screen-2xl">
            <ProductAddModal
              editMode={true}
              initialData={selectedProduct}
              onClose={() => setIsEditModalOpen(false)}
              onAdd={() => {
                fetchProducts();
                setIsEditModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;