// components/CategoryCard.jsx
import React from 'react';

const CategoryCard = ({ category }) => (
  <div
    className={`group bg-gradient-to-br ${category.gradient} rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer border border-pink-200/50 relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-500 animate-float">
        {category.icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed text-lg">{category.description}</p>
      <span className="text-lg font-bold text-pink-600 bg-white px-6 py-3 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
        {category.count}
      </span>
    </div>
    <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
      🪷
    </div>
  </div>
);

export default CategoryCard;