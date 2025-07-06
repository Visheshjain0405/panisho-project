import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart as HeartOutline, Heart as HeartFilled, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, categorySlug, viewMode = 'grid', className = '' }) => {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [avgRating, setAvgRating] = useState(null);

  const {
    _id,
    name,
    category,
    images = [],
    displayOptions = [],
    rating,
    variants = [],
    productTypes = [],
    targetAudience,
  } = product;

  const currentVariant = variants[selectedVariant] || {};
  const discountPercentage = currentVariant.mrp && currentVariant.sellingPrice
    ? Math.round(((currentVariant.mrp - currentVariant.sellingPrice) / currentVariant.mrp) * 100)
    : 0;
  const isOutOfStock = currentVariant.stock < 2;
  const inWishlist = wishlist.includes(_id);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      setCurrentImageIndex(1);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, images.length]);

  useEffect(() => {
    const fetchAvgRating = async () => {
      try {
        const res = await api.get(`/reviews/${_id}`);
        if (res.data && res.data.length > 0) {
          const total = res.data.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating((total / res.data.length).toFixed(1));
        } else {
          setAvgRating(null);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchAvgRating();
  }, [_id]);

  const handleWishlistClick = async () => {

    if (!isLoggedIn) {
      toast.warning('Please login first');
      return;
    }

    setIsToggling(true);
    try {
      await toggleWishlist(_id);
    } catch (err) {
      console.error('Wishlist toggle failed', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.warning('Please login first');
      return;
    }

    if (isOutOfStock) return;

    const variant = variants[selectedVariant];
    try {
      await addToCart({
        productId: _id,
        variant: variant,
        quantity: 1,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };


  return (
    <div
      className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${viewMode === 'list' ? 'flex flex-row items-center' : 'flex flex-col'
        } ${className}`}
      style={{ margin: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative ${viewMode === 'list' ? 'w-1/3 h-32' : 'w-full h-56'
          } bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 overflow-hidden`}
      >
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {displayOptions.includes('trending') && (
            <span className="bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Trending
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        <button
          className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110"
          onClick={handleWishlistClick}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : inWishlist ? (
            <HeartFilled size={16} className="text-pink-500" />
          ) : (
            <HeartOutline size={16} className="text-pink-400 hover:text-pink-500" />
          )}
        </button>

        <Link to={`/product/${_id}`}>
          <img
            src={images[currentImageIndex] || '/images/placeholder.png'}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect width='320' height='320' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23d1d5db' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </Link>

        <div className="absolute bottom-2 left-2 flex gap-1">
          {productTypes.map((type, index) => (
            <span
              key={index}
              className="bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-medium px-2 py-1 rounded-full border border-pink-200"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>

        <div
          className={`absolute bottom-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-1.5 rounded-full font-medium text-sm shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1 ${isOutOfStock
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-pink-500 hover:bg-pink-600 text-white hover:shadow-xl'
              }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart className="w-3 h-3" />
            {isOutOfStock ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>

      <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <p className="text-pink-500 text-xs font-semibold uppercase tracking-wide mb-1 text-start">
          {category?.title || (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Unknown Category')}
        </p>

        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-1 text-start">
          <Link to={`/product/${_id}`}>{name}</Link>
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(avgRating || 4) ? 'text-pink-400 fill-current' : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs">({avgRating || '4.0'})</span>
        </div>

        <div className="mb-2">
          <div className="flex gap-1 flex-wrap">
            <p className="text-xs font-semibold text-gray-700 mb-1 text-start">Size:</p>
            {variants.map((variant, index) => (
              <button
                key={variant.sku}
                onClick={() => setSelectedVariant(index)}
                disabled={variant.stock < 2}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${variant.stock < 2
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : selectedVariant === index
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600 border border-gray-200'
                  }`}
              >
                {variant.volume}{variant.volumeUnit}
                {variant.stock < 2 && <span className="ml-1 text-[0.6rem] text-red-500">(Out)</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{Math.floor(currentVariant.sellingPrice || 0)}
          </span>
          {currentVariant.mrp > currentVariant.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{currentVariant.mrp}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span
            className={`font-semibold ${currentVariant.stock >= 2
              ? currentVariant.stock > 10
                ? 'text-green-600'
                : 'text-orange-600'
              : 'text-red-600'
              }`}
          >
            {currentVariant.stock >= 2
              ? currentVariant.stock > 10
                ? 'In Stock'
                : `Only ${currentVariant.stock} left`
              : 'Out of Stock'}
          </span>
          <span className="text-gray-500 font-medium">
            For {targetAudience || 'All'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
