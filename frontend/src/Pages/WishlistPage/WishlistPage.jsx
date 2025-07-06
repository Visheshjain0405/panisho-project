// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../api/axiosInstance';
import ProductCard from '../../Component/Product/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, loading: wlLoading } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products, then filter by wishlist IDs
    if (!wishlist.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get('/products')
      .then(({ data }) => {
        setProducts(data.filter(p => wishlist.includes(p._id)));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [wishlist]);

  // If wishlist itself is still loading, show spinner
  if (wlLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="bg-pink-50 min-h-screen  pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-12 space-x-3">
          <Heart size={28} className="text-pink-600 animate-pulse" />
          <h1 className="text-4xl font-extrabold text-pink-700 uppercase tracking-tight">
            My Wishlist
          </h1>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-gray-600">Loading your wishlist…</p>
        ) : products.length === 0 ? (
          // Empty State
          <div className="text-center text-gray-700 space-y-4">
            <p className="text-xl">Your wishlist is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-full hover:bg-pink-700 transition"
            >
              Browse Products →
            </button>
          </div>
        ) : (
          // Products Grid
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-8
          ">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
