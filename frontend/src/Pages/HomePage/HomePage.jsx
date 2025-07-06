import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../api/axiosInstance';
import CustomerReviewsSection from './CustomerReviewsSection';
import HeroSlider from '../../Component/Slider/HeroSlider';
import CategorySection from './CategorySection';
import SaleLandingPage from './SaleLandingPage';
import ProductCard from '../../Component/Product/ProductCard';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Fetch products using Axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        const transformedProducts = response.data.map(product => ({
          _id: product._id?.$oid || product._id || `prod_${Math.random().toString(36).substr(2, 9)}`,
          name: product.name || 'Unknown Product',
          description: product.description || 'No description available',
          mrp: parseFloat(product.mrp) || 0,
          sellingPrice: parseFloat(product.sellingPrice) || 0,
          stock: parseInt(product.stock) || 0,
          images: product.images?.length ? product.images : ["https://via.placeholder.com/400"],
          keywords: Array.isArray(product.keywords) ? product.keywords : [],
          volume: product.volume ? `${product.volume}${product.volumeUnit || ''}` : 'N/A',
          category: typeof product.category === 'object' && product.category?.$oid
            ? 'Beauty Product'
            : product.category || 'Beauty Product',
          rating: parseFloat(product.rating) || 4.0 + Math.random() * 1,
          reviews: parseInt(product.reviews) || Math.floor(Math.random() * 500) + 50,
          displayOptions: Array.isArray(product.displayOptions) ? product.displayOptions : [],
          ingredients: product.ingredients || '',
          usageInstructions: product.usageInstructions || '',
          hasVariants: product.hasVariants || false,
          variants: Array.isArray(product.variants) ? product.variants : [],
          productTypes: Array.isArray(product.productTypes) ? product.productTypes : [],
          targetAudience: product.targetAudience || 'Unisex',
        }));
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on displayOptions
  const trendingProducts = products.filter(p => p.displayOptions.includes('trending')).slice(0, 4);
  const bestSellers = products.filter(p => p.displayOptions.includes('bestSelling')).slice(0, 4);
  const featuredProducts = products.filter(p => p.displayOptions.includes('featured')).slice(0, 4);

  const slides = [
    {
      title: "Lotus Beauty Collection",
      subtitle: "Discover the power of nature with our premium lotus-infused beauty essentials",
      gradient: "from-pink-300 via-rose-300 to-pink-400",
      cta: "Shop Collection",
      decorativeIcon: "🪷"
    },
    {
      title: "Radiant Skin Essentials",
      subtitle: "Unlock your natural glow with our carefully curated skincare range",
      gradient: "from-rose-300 via-pink-200 to-rose-400",
      cta: "Explore Now",
      decorativeIcon: "🌸"
    },
    {
      title: "Hair Care Revolution",
      subtitle: "Transform your hair with our nourishing and revitalizing hair care products",
      gradient: "from-pink-200 via-rose-300 to-pink-300",
      cta: "Discover More",
      decorativeIcon: "✨"
    },
  ];

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getDiscountPercentage = (mrp, sellingPrice) => {
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-amber-400 text-xs sm:text-sm">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-amber-400 text-xs sm:text-sm">★</span>);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 text-xs sm:text-sm">★</span>);
    }
    return stars;
  };


  const ProductSection = ({ title, products, showViewAll = true, bgColor = "bg-gray-50" }) => (
    <section className={`py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">{title}</h2>
            <div className="w-20 sm:w-24 md:w-32 h-1.5 sm:h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
            <div className="absolute -top-3 sm:-top-4 -right-6 sm:-right-8 text-2xl sm:text-3xl md:text-4xl opacity-20">🪷</div>
          </div>
          {showViewAll && (
            <button className="text-pink-600 font-bold hover:text-pink-700 transition-colors flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base group">
              View All Products
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 animate-pulse">
                <div className="bg-gray-300 h-40 sm:h-48 md:h-72 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 md:mb-6"></div>
                <div className="bg-gray-300 h-4 sm:h-5 md:h-6 rounded mb-2 sm:mb-3 md:mb-4"></div>
                <div className="bg-gray-300 h-3 sm:h-4 rounded mb-2 sm:mb-3 md:mb-4"></div>
                <div className="bg-gray-300 h-8 sm:h-10 md:h-12 rounded-xl sm:rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 py-6 sm:py-8 md:py-12">
            <p className="text-sm sm:text-base md:text-lg">No products available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const customerReviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      review: "Absolutely love the lotus-infused moisturizer! My skin feels so hydrated and smooth.",
      date: "2025-06-15",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Rahul Verma",
      rating: 4,
      review: "The hair serum is fantastic, but I wish it came in a larger size.",
      date: "2025-06-10",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Anita Desai",
      rating: 5,
      review: "The skincare range has transformed my daily routine. Highly recommend!",
      date: "2025-06-05",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hero Slider */}
      <HeroSlider slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />

      <CategorySection />

      {/* Banner Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/10 to-transparent"></div>
          <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-white relative z-10">
          <div className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-4 sm:mb-6 md:mb-8 animate-float">🌸</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Special Beauty Offer</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 md:mb-12 opacity-95 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
            Get up to 50% off on premium skincare products. Limited time offer on selected items.
          </p>
          <button className="bg-white text-pink-600 px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl touch-none">
            Shop Now & Save
          </button>
        </div>
      </section>

      <SaleLandingPage />

      {/* Product Sections */}
      {trendingProducts.length > 0 && (
        <ProductSection
          title="Trending Products"
          products={trendingProducts}
          bgColor="bg-gradient-to-br from-pink-50 to-white"
        />
      )}

      {bestSellers.length > 0 && (
        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          bgColor="bg-white"
        />
      )}

      {featuredProducts.length > 0 && (
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
          bgColor="bg-gradient-to-br from-rose-50 to-pink-50"
        />
      )}

      {/* Newsletter Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 text-4xl sm:text-6xl md:text-9xl opacity-5 animate-float">🪷</div>
          <div className="absolute bottom-1/4 right-1/4 text-3xl sm:text-5xl md:text-7xl opacity-5 animate-float-delay">🌸</div>
          <div className="absolute top-1/2 right-1/3 text-3xl sm:text-5xl md:text-8xl opacity-5 animate-float-delay-2">✨</div>
        </div>
        <div className="max-w-5xl mx-auto text-center text-white relative z-10">
          <div className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-4 sm:mb-6 md:mb-8 animate-float">💌</div>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Join Our Beauty Community</h3>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 md:mb-12 opacity-95 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
            Get exclusive access to new launches, beauty tips, special offers, and insider secrets from beauty experts
          </p>
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto border border-white/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-800 text-xs sm:text-sm md:text-base placeholder-gray-500 shadow-lg"
              />
              <button className="bg-white text-pink-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap touch-none">
                Subscribe Now
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base opacity-90">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-2xl">🎁</span>
                <span>Exclusive Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-2xl">💡</span>
                <span>Beauty Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-2xl">⭐</span>
                <span>Early Access</span>
              </div>
            </div>
            <p className="text-xs sm:text-xs md:text-sm mt-3 sm:mt-4 md:mt-6 opacity-75">Join 100,000+ beauty enthusiasts worldwide • Unsubscribe anytime</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">🚚</div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">Free Shipping</h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">On orders above ₹999</p>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">Secure Payment</h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">100% secure transactions</p>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">↩️</div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">Easy Returns</h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">30-day return policy</p>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      <CustomerReviewsSection reviews={customerReviews} />

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg z-50">
          <p className="font-semibold text-xs sm:text-sm">Error</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(80px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        
        .animate-slide-up {
          animation: slide-up 1.5s ease-out;
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 12s ease-in-out infinite 2s;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 14s ease-in-out infinite 4s;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #f43f5e);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #db2777, #e11d48);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
