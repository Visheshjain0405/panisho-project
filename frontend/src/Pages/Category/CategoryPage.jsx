// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Filter,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  ChevronDown,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import ProductCard from '../../Component/Product/ProductCard';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  console.log('Category slug:', categorySlug);
  // — state —
  const [title, setTitle] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters & controls
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('all');

  // sorting & view
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  // sidebar toggle
  const [showFilters, setShowFilters] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Fetch category & products
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: cats } = await api.get('/categories');
        const cat = cats.find(c => c.slug === categorySlug);
        setTitle(cat?.title || 'Category');

        const { data: prods } = await api.get(
          `/products/category/${categorySlug}`
        );
        setAllProducts(prods);
        console.log('Fetched products:', prods);
      } catch (err) {
        console.error(err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug]);

  // Apply filters & sorting
  useEffect(() => {
    let tmp = allProducts.filter(p => p.sellingPrice <= maxPrice);

    if (minRating > 0) tmp = tmp.filter(p => p.rating >= minRating);
    if (availability !== 'all') {
      tmp = tmp.filter(p => {
        if (availability === 'in-stock') return p.stock > 5;
        if (availability === 'low-stock') return p.stock > 0 && p.stock <= 5;
        return p.stock === 0;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tmp = tmp.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low':
        tmp.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        tmp.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'rating':
        tmp.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        tmp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setPage(1);
    setFiltered(tmp);
  }, [allProducts, maxPrice, minRating, availability, searchQuery, sortBy]);

  // Pagination slice
  const lastIdx = page * perPage;
  const firstIdx = lastIdx - perPage;
  const pageItems = filtered.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-6 w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="h-12 bg-pink-100 rounded w-1/3 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      {/* Page Title */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold text-pink-600 text-center">
            {title}
          </h1>
          <div className="mt-2 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>
      </div>

      {/* Filters + Products */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="col-span-12 md:col-span-3 bg-pink-50 border border-pink-200 rounded-2xl p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-pink-600 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-pink-600 mb-1">
                Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="w-full accent-pink-600"
              />
            </div>

            {/* Rating */}
            <div className="mb-6">
              <span className="block text-pink-600 mb-1">Min Rating</span>
              {[4, 3, 2, 1].map(r => (
                <label key={r} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                    className="accent-pink-600"
                  />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 ${i < r ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-pink-700">& up</span>
                </label>
              ))}
              <button
                onClick={() => setMinRating(0)}
                className="text-sm text-pink-600 underline mt-1"
              >
                Clear
              </button>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <span className="block text-pink-600 mb-1">Availability</span>
              {[
                ['all', 'All'],
                ['in-stock', 'In stock'],
                ['low-stock', 'Low stock'],
                ['out-of-stock', 'Out of stock'],
              ].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="avail"
                    checked={availability === val}
                    onChange={() => setAvailability(val)}
                    className="accent-pink-600"
                  />
                  <span className="text-pink-700">{label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setMaxPrice(1000);
                setMinRating(0);
                setAvailability('all');
                setSortBy('featured');
              }}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Clear All
            </button>
          </aside>
        )}

        {/* Main Content */}
        <section
          className={`col-span-12 ${showFilters ? 'md:col-span-9' : ''
            } space-y-6`}
        >
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-pink-600 border border-pink-200 rounded-xl shadow hover:shadow-lg transition"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>

            <div className="flex flex-wrap items-center gap-4">
              {/* Sort by */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label htmlFor="sortBy" className="text-gray-700 font-medium whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-[200px] px-4 py-2 text-pink-600 bg-white border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              {/* View toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition ${viewMode === 'grid'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-white text-pink-600 border border-pink-200 shadow'
                    }`}
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition ${viewMode === 'list'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-white text-pink-600 border border-pink-200 shadow'
                    }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-600 py-20">
              No products found.
            </p>
          ) : viewMode === 'list' ? (
            <div className="space-y-6">
              {pageItems.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  categorySlug={categorySlug}
                  viewMode="list"
                />
              ))}
            </div>
          ) : (
            <div
              className={
                showFilters
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              }
            >
              {pageItems.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  categorySlug={categorySlug}
                  viewMode="grid"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-pink-200 rounded-lg disabled:opacity-50 hover:bg-pink-50 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pg = idx + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`
                      px-4 py-2 rounded-lg transition
                      ${pg === page
                        ? 'bg-pink-600 text-white'
                        : 'border border-pink-200 hover:bg-pink-50'
                      }
                    `}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 border border-pink-200 rounded-lg disabled:opacity-50 hover:bg-pink-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
