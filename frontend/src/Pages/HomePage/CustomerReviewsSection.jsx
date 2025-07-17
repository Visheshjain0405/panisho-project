import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';

const CustomerReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ avgRating: null, totalReviews: null });

  // Backend API configuration
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  });

  // Fetch reviews and stats from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reviews/random');
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
        const response = await api.get('/reviews/stats');
        setStats(response.data);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
        setError("Failed to load statistics.");
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
        <span key={i} className={`text-xl sm:text-2xl ${i < rating ? 'text-pink-400' : 'text-pink-200'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // SVG Components
  const LotusSVG = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M50 85c-4.5-8-12-15-20-18 0 8 4 16 12 20 8 4 16 2 20-2z" fill="#f472b6" fillOpacity="0.8"/>
        <path d="M50 85c4.5-8 12-15 20-18 0 8-4 16-12 20-8 4-16 2-20-2z" fill="#f472b6" fillOpacity="0.8"/>
        <path d="M50 85c-8-4.5-15-12-18-20 8 0 16 4 20 12 4 8 2 16-2 20z" fill="#ec4899" fillOpacity="0.9"/>
        <path d="M50 85c8-4.5 15-12 18-20-8 0-16 4-20 12-4 8-2 16 2 20z" fill="#ec4899" fillOpacity="0.9"/>
        <path d="M50 85c-4.5-12-8-20-8-28 0-8 8-12 16-12s16 4 16 12c0 8-3.5 16-8 28z" fill="#fce7f3" fillOpacity="0.9"/>
        <circle cx="50" cy="50" r="8" fill="#f9a8d4"/>
        <circle cx="50" cy="50" r="4" fill="#fbbf24"/>
      </g>
    </svg>
  );

  const QuoteSVG = ({ className = "" }) => (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 17L12 13L16 17M8 7L12 11L16 7" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H9C10.1046 5 11 5.89543 11 7V11C11 12.1046 10.1046 13 9 13H5C3.89543 13 3 12.1046 3 11V7Z" fill="#fce7f3"/>
      <path d="M13 7C13 5.89543 13.8954 5 15 5H19C20.1046 5 21 5.89543 21 7V11C21 12.1046 20.1046 13 19 13H15C13.8954 13 13 12.1046 13 11V7Z" fill="#fce7f3"/>
    </svg>
  );

  const HeartSVG = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#ec4899"/>
    </svg>
  );

  const ReviewCard = ({ review, isActive, index }) => (
    <div className={`absolute inset-0 transition-all duration-1000 transform ${isActive ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-full'}`}>
      <div className="bg-gradient-to-br from-white via-pink-50 to-white rounded-[2rem] shadow-2xl p-8 sm:p-12 h-full border border-pink-200 relative overflow-hidden backdrop-blur-sm">
        {/* Background Decorative Elements */}
        <div className="absolute -top-4 -right-4 opacity-10">
          <LotusSVG size={120} className="text-pink-300" />
        </div>
        <div className="absolute -bottom-6 -left-6 opacity-10">
          <LotusSVG size={100} className="text-pink-400" />
        </div>
        {/* Floating Petals */}
        <div className="absolute top-1/4 right-1/4 opacity-20 animate-float">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <ellipse cx="15" cy="15" rx="12" ry="6" fill="#f472b6" transform="rotate(45 15 15)"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/3 opacity-20 animate-float-delay">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <ellipse cx="12.5" cy="12.5" rx="10" ry="5" fill="#ec4899" transform="rotate(-30 12.5 12.5)"/>
          </svg>
        </div>
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 opacity-40">
          <QuoteSVG />
        </div>
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Avatar and Info */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {review.customerName.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <LotusSVG size={20} className="text-pink-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {review.customerName}
                </h4>
                <HeartSVG className="opacity-60" />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-gradient-to-r from-pink-100 to-pink-200 px-3 py-1 rounded-full">
                  {renderStars(review.rating)}
                </div>
                <span className="text-gray-500 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {/* Review Content */}
          <div className="flex-1 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {review.title}
            </h3>
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-pink-100 shadow-inner">
              <p className="text-gray-700 text-lg sm:text-xl leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
            <div className="bg-gradient-to-r from-pink-100 via-white to-pink-100 rounded-2xl p-5 border border-pink-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <LotusSVG size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-pink-800 font-semibold text-sm sm:text-base">
                    Product Used
                  </p>
                  <p className="text-pink-700 font-bold text-base sm:text-lg">
                    {review.productName}
                  </p>
                </div>
              </div>
            </div>
            {review.images && review.images.length > 0 && (
              <div className="mt-6 flex gap-3 overflow-x-auto">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl border-2 border-pink-200 shadow-lg"
                  />
                ))}
              </div>
            )}
            {review.adminReply && (
              <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-pink-100">
                <p className="text-gray-700 font-semibold text-sm sm:text-base">
                  Admin Reply: {review.adminReply.message}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                  {new Date(review.adminReply.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          {/* Verification Badge */}
          {review.verified && (
            <div className="mt-6 flex items-center gap-2 text-pink-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-medium">Verified Customer</span>
            </div>
          )}
        </div>
        {/* Decorative Border */}
        <div className="absolute inset-0 rounded-[2rem] border-2 border-gradient-to-r from-pink-200 via-transparent to-pink-200 opacity-50"></div>
      </div>
    </div>
  );

  return (
    <section className="py-16 sm:py-28 px-4 bg-gradient-to-br from-pink-50 via-white to-pink-100 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 opacity-5 animate-float">
          <LotusSVG size={150} />
        </div>
        <div className="absolute bottom-1/4 right-1/6 opacity-5 animate-float-delay">
          <LotusSVG size={120} />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-5 animate-float-delay-2">
          <LotusSVG size={100} />
        </div>
        {/* Floating Petals */}
        <div className="absolute top-1/3 left-1/3 opacity-10 animate-float">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="20" rx="15" ry="8" fill="#f472b6" transform="rotate(20 20 20)"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/3 opacity-10 animate-float-delay">
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
            <ellipse cx="17.5" cy="17.5" rx="12" ry="7" fill="#ec4899" transform="rotate(-45 17.5 17.5)"/>
          </svg>
        </div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="mb-8 sm:mb-12 flex justify-center">
            <LotusSVG size={100} className="animate-float" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6 sm:mb-8">
            What Our Beautiful Customers Say
          </h2>
          <p className="text-lg sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Real stories from real customers who've transformed their beauty routine with our lotus-infused products
          </p>
          <div className="w-32 sm:w-40 h-2 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 mx-auto mt-8 sm:mt-10 rounded-full shadow-lg"></div>
        </div>
        {/* Reviews Container */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-600 text-lg">Loading reviews...</div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">No reviews available.</div>
          ) : (
            <>
              <div className="relative h-[550px] sm:h-[600px] mb-12 sm:mb-16">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isActive={index === currentReview}
                    index={index}
                  />
                ))}
              </div>
              {/* Enhanced Navigation Dots */}
              <div className="flex justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-300 ${
                      index === currentReview
                        ? 'bg-gradient-to-r from-pink-400 to-pink-600 scale-125 shadow-lg'
                        : 'bg-pink-200 hover:bg-pink-300'
                    }`}
                  >
                    {index === currentReview && (
                      <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-30"></div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-200 hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <LotusSVG size={60} />
              </div>
              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl mb-6 text-pink-500">⭐</div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
                  <CountUp end={Number(stats.avgRating) || 0} duration={2} decimals={1} /> / 5
                </div>
                <p className="text-gray-600 font-semibold text-base sm:text-lg">Average Rating</p>
                <p className="text-sm sm:text-base text-pink-600 mt-3">
                  <CountUp end={stats.totalReviews || 0} duration={2} /> Reviews
                </p>
              </div>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-200 hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <LotusSVG size={60} />
              </div>
              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl mb-6 text-pink-500">💖</div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">98%</div>
                <p className="text-gray-600 font-semibold text-base sm:text-lg">Satisfaction Rate</p>
                <p className="text-sm sm:text-base text-pink-600 mt-3">Would recommend to friends</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-200 hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <LotusSVG size={60} />
              </div>
              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl mb-6 text-pink-500">🏆</div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
                  {stats.totalReviews > 1000 ? (
                    <CountUp end={stats.totalReviews} duration={2} suffix="+" />
                  ) : (
                    '1k+'
                  )}
                </div>
                <p className="text-gray-600 font-semibold text-base sm:text-lg">Happy Customers</p>
                <p className="text-sm sm:text-base text-pink-600 mt-3">And growing every day</p>
              </div>
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