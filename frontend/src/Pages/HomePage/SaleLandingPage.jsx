import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import api from '../../api/axiosInstance';

const SaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 256,
    hours: 22,
    minutes: 49,
    seconds: 27,
  });

  const [leftProducts, setLeftProducts] = useState([]);
  const [rightProducts, setRightProducts] = useState([]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Products on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const all = res.data || [];

        // Shuffle and pick 6 random products
        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        setLeftProducts(selected.slice(0, 3));
        setRightProducts(selected.slice(3));
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Single Product Card
  const ProductCard = ({ product }) => {
    const variant = product.variants?.[0] || {};
    const discount = variant.mrp && variant.sellingPrice
      ? Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)
      : 0;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 flex items-start gap-4 hover:shadow-xl transition-shadow duration-300 border border-pink-100 w-full">
        <div className="relative flex-shrink-0">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/80'}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
          />
          <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase font-semibold text-pink-600 tracking-wide">
            {product.category?.title || 'PRODUCT'}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-800 mt-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-pink-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < 4 ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(4.2 Reviews)</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-base sm:text-lg font-bold text-green-600">
              ₹{variant.sellingPrice?.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{variant.mrp?.toFixed(2)}
            </p>
          </div>
          <button className="mt-2 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-pink-600 transition-colors duration-200 flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 text-gray-800 w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      {/* Header and Timer */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-600 mb-4">
          50% <span className="text-pink-500">SALE!</span>
        </h1>
        <p className="text-lg sm:text-xl text-pink-700 mb-6 sm:mb-8 font-medium">
          Limited Time Offer - Don't Miss Out!
        </p>

        {/* Timer */}
        <div className="flex justify-center space-x-4 sm:space-x-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div
              key={unit}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-pink-200 min-w-[60px] sm:min-w-[70px]"
            >
              <div className="text-2xl sm:text-3xl font-bold text-pink-600">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-pink-500 uppercase">
                {unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 w-full max-w-7xl mx-auto">
        {/* Left Products */}
        <div className="flex flex-col gap-4 w-full max-w-md md:max-w-sm">
          {leftProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Center Image */}
        <div className="flex justify-center items-center w-full max-w-md md:max-w-lg my-6 md:my-0">
          <img
            src="https://res.cloudinary.com/djh2ro9tm/image/upload/v1751743238/model-removebg-preview_nuugeh.png"
            alt="Model"
            className="w-full h-auto object-contain max-h-[400px] md:max-h-[600px]"
          />
        </div>

        {/* Right Products */}
        <div className="flex flex-col gap-4 w-full max-w-md md:max-w-sm">
          {rightProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;