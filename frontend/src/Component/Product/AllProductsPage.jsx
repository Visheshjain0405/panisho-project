import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import ProductCard from './ProductCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const AllProductsPage = () => {
  const query = useQuery();
  const section = query.get('section'); // 'trending', 'bestSelling', or 'featured'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const getTitle = () => {
  switch (section) {
    case 'trending': return 'All Trending Products';
    case 'bestSelling': return 'All Best Sellers';
    case 'featured': return 'All Featured Products';
    case 'topSelling': return 'All Most Selling Products';
    default: return 'All Products';
  }
};


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let filtered = [];

        if (section === 'topSelling') {
          const res = await api.get('/orders/top-selling-products');
          filtered = res.data.map(product => {
            const primaryVariant = product.variants?.[0] || {};
            return {
              _id: product.productId,
              name: product.name || 'Unknown',
              description: product.description || '',
              images: product.images?.length ? product.images : ['https://via.placeholder.com/400'],
              mrp: parseFloat(primaryVariant.mrp) || 0,
              sellingPrice: parseFloat(primaryVariant.sellingPrice) || 0,
              stock: parseInt(primaryVariant.stock) || 0,
              volume: primaryVariant.volume ? `${primaryVariant.volume}${primaryVariant.volumeUnit}` : 'N/A',
              variants: product.variants || [],
              rating: Math.random() * 1 + 4,
              reviews: Math.floor(Math.random() * 300 + 50),
            };
          });
        } else {
          const res = await api.get('/products');
          filtered = section
            ? res.data.filter(p => p.displayOptions?.includes(section))
            : res.data;
        }

        setProducts(filtered);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [section]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{getTitle()}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProductsPage;
