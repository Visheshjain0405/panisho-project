import { useState } from 'react';
import { ChevronRight, Heart, ShoppingBag, Search } from 'lucide-react';

const ProductCategories = () => {
  const [activeCategory, setActiveCategory] = useState('beauty');
  
  const categories = {
    beauty: [
      { name: 'Facewash', count: 12, image: '/api/placeholder/400/320' },
      { name: 'Face Serum', count: 8, image: '/api/placeholder/400/320' },
      { name: 'Sunscreen', count: 6, image: '/api/placeholder/400/320' },
      { name: 'Makeup', count: 15, image: '/api/placeholder/400/320' },
      { name: 'Body Care', count: 9, image: '/api/placeholder/400/320' }
    ],
    hair: [
      { name: 'Shampoo', count: 10, image: '/api/placeholder/400/320' },
      { name: 'Conditioner', count: 7, image: '/api/placeholder/400/320' },
      { name: 'Beard Oil', count: 5, image: '/api/placeholder/400/320' },
      { name: 'Hair Treatments', count: 8, image: '/api/placeholder/400/320' },
      { name: 'Styling Products', count: 12, image: '/api/placeholder/400/320' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      {/* Header Banner */}
      <div className="bg-pink-50 p-3 text-center rounded-lg mb-10">
        <p className="text-pink-600 font-medium">FREE STANDARD SHIPPING ON ALL U.S. ORDERS</p>
      </div>
      
      {/* Page Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Shop By Category</h2>
        <p className="text-gray-600 mt-2">Discover our premium collection of beauty and hair care products</p>
      </div>
      
      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-pink-100 p-1">
          <button 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'beauty' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-pink-700 hover:bg-pink-200'
            }`}
            onClick={() => setActiveCategory('beauty')}
          >
            Beauty Products
          </button>
          <button 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'hair' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-pink-700 hover:bg-pink-200'
            }`}
            onClick={() => setActiveCategory('hair')}
          >
            Hair Products
          </button>
        </div>
      </div>
      
      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories[activeCategory].map((item, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-pink-100"
          >
            {/* Product Image */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                  <Search size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                  <Heart size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
            
            {/* Category Info */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <span className="text-sm text-pink-500 font-medium">{item.count} Products</span>
              </div>
              <a 
                href="#" 
                className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
              >
                Shop Collection <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Featured Categories Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Banner 1 */}
        <div className="relative rounded-xl overflow-hidden h-64 group">
          <img 
            src="/api/placeholder/600/400" 
            alt="Beauty Products" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-transparent flex flex-col justify-center px-8">
            <p className="text-white font-medium mb-1">NEW COLLECTION</p>
            <h3 className="text-3xl font-bold text-white mb-4">Beauty Products</h3>
            <a 
              href="#" 
              className="bg-white text-pink-600 px-6 py-2 rounded-full text-sm font-medium inline-flex items-center w-fit hover:bg-pink-50 transition-colors"
            >
              Shop Now <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
        
        {/* Banner 2 */}
        <div className="relative rounded-xl overflow-hidden h-64 group">
          <img 
            src="/api/placeholder/600/400" 
            alt="Hair Products" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 to-transparent flex flex-col justify-center px-8">
            <p className="text-white font-medium mb-1">SPECIAL OFFERS</p>
            <h3 className="text-3xl font-bold text-white mb-4">Hair Products</h3>
            <a 
              href="#" 
              className="bg-white text-pink-600 px-6 py-2 rounded-full text-sm font-medium inline-flex items-center w-fit hover:bg-pink-50 transition-colors"
            >
              Shop Now <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* Card 1 */}
        <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-xl p-6 flex flex-col justify-between min-h-56 shadow-sm">
          <div>
            <p className="text-pink-600 font-medium text-lg mb-2">SPECIAL OFFER</p>
            <h3 className="text-2xl font-bold text-gray-800">10% OFF</h3>
            <p className="text-xl text-gray-800">Body Butter</p>
          </div>
          <a href="#" className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors">
            SHOP NOW <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
        
        {/* Card 2 */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-xl p-6 flex flex-col justify-between min-h-56 shadow-sm">
          <div>
            <p className="text-pink-600 font-medium text-lg mb-2">NEW ARRIVAL</p>
            <h3 className="text-2xl font-bold text-gray-800">Premium</h3>
            <p className="text-xl text-gray-800">Face Serums</p>
          </div>
          <a href="#" className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors">
            SHOP NOW <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
        
        {/* Card 3 */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-200 rounded-xl p-6 flex flex-col justify-between min-h-56 shadow-sm">
          <div>
            <p className="text-pink-700 font-medium text-lg mb-2">TRENDING</p>
            <h3 className="text-2xl font-bold text-gray-800">Natural</h3>
            <p className="text-xl text-gray-800">Shampoos</p>
          </div>
          <a href="#" className="inline-flex items-center text-pink-700 font-medium hover:text-pink-800 transition-colors">
            SHOP NOW <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-white border border-pink-100 rounded-xl p-8 shadow-sm mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Join Our Newsletter</h3>
        <p className="text-gray-600 mb-6">Stay updated with our latest products and special offers</p>
        <div className="flex max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 border border-gray-200 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;