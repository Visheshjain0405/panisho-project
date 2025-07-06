import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import CountUp from 'react-countup';
const CustomerReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ avgRating: null, totalReviews: null });

  // Fetch random reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reviews/random');
        console.log(response.data)
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await api.get('/reviews/stats');
        setStats(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("❌ Error loading stats:", err);
      }
    };
    fetchReviews();
    fetchStats();

  }, []);

  // Auto-advance reviews
  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-lg sm:text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const ReviewCard = ({ review, isActive, index }) => (
    <div className={`absolute inset-0 transition-all duration-1000 transform ${isActive ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-full'
      }`}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 h-full border-2 border-pink-100 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 text-7xl sm:text-9xl opacity-5 text-pink-300">🪷</div>
        <div className="absolute -bottom-8 -left-8 sm:-bottom-10 sm:-left-10 text-6xl sm:text-7xl opacity-5 text-rose-300">🌸</div>

        {/* Quote Icon */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-3xl sm:text-4xl text-pink-300 opacity-30">"</div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative">
              <img
                src={review.avatar || 'https://via.placeholder.com/150'}
                alt={review.customerName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-pink-200 shadow-lg"
              />
              {review.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {review.customerName}
              </h4>
              <p className="text-pink-600 font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                <span className="text-base sm:text-lg">📍</span>
                Location not provided
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 leading-tight">
              {review.title}
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
              {review.comment}
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
              <p className="text-pink-700 font-semibold text-xs sm:text-sm">
                <span className="text-pink-500">💄</span> Product: {review.productName}
              </p>
            </div>
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-pink-200"
                  />
                ))}
              </div>
            )}
            {review.adminReply && (
              <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-gray-700 font-semibold text-sm sm:text-base">
                  Admin Reply: {review.adminReply.message}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                  {new Date(review.adminReply.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Verified Badge */}
          {review.verified && (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm sm:text-base">
              <span className="text-base sm:text-xl">✅</span>
              <span>Verified Purchase</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-24 px-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 text-6xl sm:text-8xl opacity-5 text-pink-300 animate-float">🪷</div>
        <div className="absolute bottom-1/4 right-1/6 text-5xl sm:text-6xl opacity-5 text-rose-300 animate-float-delay">🌸</div>
        <div className="absolute top-1/2 right-1/4 text-5xl sm:text-7xl opacity-5 text-pink-300 animate-float-delay-2">✨</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 animate-float">💝</div>
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
            What Our Beautiful Customers Say
          </h2>
          <p className="text-lg sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from real customers who've transformed their beauty routine with our lotus-infused products
          </p>
          <div className="w-24 sm:w-32 h-2 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-6 sm:mt-8 rounded-full"></div>
        </div>

        {/* Reviews Container */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-600 text-lg">Loading reviews...</div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">No reviews available.</div>
          ) : (
            <>
              <div className="relative h-[450px] sm:h-[500px] mb-8 sm:mb-12">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isActive={index === currentReview}
                    index={index}
                  />
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${index === currentReview
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 scale-125 shadow-lg'
                      : 'bg-pink-200 hover:bg-pink-300'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-4 text-pink-500">⭐</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                <CountUp end={Number(stats.avgRating) || 0} duration={2} decimals={1} /> / 5
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Average Rating</p>
              <p className="text-xs sm:text-sm text-pink-600 mt-2">
                <CountUp end={stats.totalReviews || 0} duration={2} /> Reviews
              </p>

            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-4 text-rose-500">💖</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">98%</div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Satisfaction Rate</p>
              <p className="text-xs sm:text-sm text-pink-600 mt-2">Would recommend to friends</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-4 text-pink-500">🏆</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                <CountUp end={stats.totalReviews || 0} duration={2} suffix="+" />
              </div>

              <p className="text-gray-600 font-medium text-sm sm:text-base">Happy Customers</p>
              <p className="text-xs sm:text-sm text-pink-600 mt-2">And growing every day</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 12s ease-in-out infinite 2s;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 14s ease-in-out infinite 4s;
        }

        @media (max-width: 640px) {
          .animate-float, .animate-float-delay, .animate-float-delay-2 {
            animation-duration: 8s;
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerReviewsSection;