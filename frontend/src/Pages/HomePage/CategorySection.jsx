import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  const categoryRoutes = {
    facewash: '/beauty-products/facewash',
    faceserum: '/beauty-products/face-serum',
    sunscreen: '/beauty-products/sunscreen',
    shampoo: '/hair-products/shampoo',
    conditioner: '/hair-products/conditioner',
    beardoil: '/hair-products/beard-oil',
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data.map((cat) => ({
          name: cat.title,
          image: cat.image,
          gradient: 'from-pink-400 to-rose-500',
          hoverGradient: 'from-pink-500 to-rose-600',
        }));
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const CategoryCard = ({ category }) => (
    <Link
       to={categoryRoutes[category.name.toLowerCase().replace(/\s+/g, '')] || '#'}
      className="group flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105"
    >
      <div
        className={`
          relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56
          rounded-full bg-gradient-to-br ${category.gradient}
          group-hover:bg-gradient-to-br group-hover:${category.hoverGradient}
          shadow-xl group-hover:shadow-pink-500/40
          transition-all duration-700 ease-out
          flex items-center justify-center
          cursor-pointer
          border-4 border-white/30 group-hover:border-white/60
          overflow-hidden
          p-2
          transform group-hover:rotate-1
        `}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white/15 backdrop-blur-sm border-2 border-white/40 group-hover:border-white/60 transition-all duration-500">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-115 group-hover:brightness-110 group-hover:contrast-105"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/f9a8d4/ffffff?text=${category.name.replace(' ', '+')}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 to-rose-500/15 group-hover:from-pink-600/25 group-hover:to-rose-600/25 transition-all duration-700"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 animate-shimmer"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-all duration-700">
            <div className="text-3xl sm:text-4xl lg:text-5xl animate-pulse transform group-hover:rotate-180 transition-transform duration-1000">🪷</div>
          </div>
        </div>
      </div>

      <h3 className="mt-6 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
        {category.name}
      </h3>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-16 sm:py-20 lg:py-28 px-4 relative overflow-hidden font-inter">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-5 animate-float">🪷</div>
        <div className="absolute top-1/4 right-20 text-4xl opacity-5 animate-float-delay">🌸</div>
        <div className="absolute bottom-20 left-1/4 text-5xl opacity-5 animate-float-delay-2">✨</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-5 animate-float">🌺</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-6 animate-float">🪷</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Explore Our
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> Collections</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Discover our carefully curated beauty categories.
          </p>
          <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 sm:gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 sm:gap-y-16 lg:gap-y-20 justify-items-center">
          {categories.map((cat, i) => (
            <CategoryCard key={i} category={cat} />
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-180deg); }
        }

        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(90deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite 2s;
        }

        .animate-float-delay-2 {
          animation: float-delay-2 12s ease-in-out infinite 4s;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default CategorySection;
