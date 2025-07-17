import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Sparkles } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchClick = () => {
    setIsOpen(!isOpen);
    setShowFilters(false);
  };

  const popularSearches = [
    'Face Serum',
    'Sunscreen',
    'Shampoo',
    'Beard Oil',
    'Moisturizer',
    'Hair Mask',
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Trigger Button */}
      <button
        onClick={handleSearchClick}
        className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 hover:scale-110"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-pink-100 z-50 overflow-hidden">
          {/* Search Input Section */}
          <div className="p-4 border-b border-pink-50">
            <div className="relative bg-pink-50 rounded-full shadow-inner">
              {/* Lotus Petal Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -top-0.5 -right-2 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-pulse delay-300"></div>
              <div className="absolute -bottom-1 left-3 w-3 h-3 bg-pink-100 rounded-full opacity-50 animate-pulse delay-500"></div>
              
              <div className="flex items-center px-4 py-3">
                <Search size={20} className="text-pink-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for beauty & hair products..."
                  className="flex-1 ml-3 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-sm font-medium"
                />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="ml-2 p-1 text-gray-400 hover:text-pink-600 transition-colors duration-200 hover:bg-pink-100 rounded-full"
                  >
                    <X size={16} />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`ml-2 p-1 transition-all duration-200 rounded-full ${
                    showFilters
                      ? 'text-pink-600 bg-pink-200'
                      : 'text-gray-400 hover:text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  <Filter size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ml-2 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="p-4 border-b border-pink-50 bg-pink-25">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Filters</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-sm">
                    <option>All Categories</option>
                    <option>Beauty Products</option>
                    <option>Hair Products</option>
                    <option>Skincare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                  <select className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-sm">
                    <option>All Prices</option>
                    <option>Under ₹500</option>
                    <option>₹500 - ₹1000</option>
                    <option>Above ₹1000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Brand</label>
                  <select className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-sm">
                    <option>All Brands</option>
                    <option>Panisho</option>
                    <option>Premium</option>
                    <option>Natural</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-1.5 text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4 border-b border-pink-50">
            <div className="flex items-center mb-3">
              <Sparkles size={16} className="text-pink-500 mr-2" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Popular Searches
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    window.location.href = `/search?q=${encodeURIComponent(search)}`;
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-medium hover:bg-pink-100 transition-all duration-200 hover:scale-105"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Preview */}
          {searchQuery && (
            <div className="p-4">
              <div className="text-xs text-gray-600 mb-3">
                Showing results for "{searchQuery}"
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center p-2 hover:bg-pink-50 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-pink-100 rounded-lg mr-3 flex items-center justify-center">
                      <Search size={16} className="text-pink-500" />
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium text-sm">Product {item}</div>
                      <div className="text-xs text-gray-500">Beauty & Hair Care</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decorative Lotus Background Element */}
      {isOpen && (
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-400">
              <path d="M50 10 Q60 30 50 50 Q40 30 50 10 Z" fill="currentColor" />
              <path d="M50 10 Q70 20 50 50 Q30 20 50 10 Z" fill="currentColor" />
              <path d="M50 10 Q75 35 50 50 Q25 35 50 10 Z" fill="currentColor" />
              <path d="M50 10 Q80 45 50 50 Q20 45 50 10 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;