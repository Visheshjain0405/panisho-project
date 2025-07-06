import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, User, ChevronDown, Menu, X, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user } = useContext(AuthContext);
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  };

  const beautyProductsItems = [
    { name: 'Facewash', path: '/beauty-products/facewash' },
    { name: 'Face Serum', path: '/beauty-products/face-serum' },
    { name: 'Sunscreen', path: '/beauty-products/sunscreen' },
  ];

  const hairProductsItems = [
    { name: 'Shampoo', path: '/hair-products/shampoo' },
    { name: 'Conditioner', path: '/hair-products/conditioner' },
    { name: 'Beard Oil', path: '/hair-products/beard-oil' },
  ];

  const CartCount = () => {
    return cart.length > 0 ? (
      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md transition-all duration-300">
        {cart.length}
      </span>
    ) : null;
  };

  return (
    <nav className={`w-full fixed top-0 z-[1100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-2xl' : 'bg-white shadow-md'}`}>
      <div className="bg-pink-100 text-gray-800 py-2 text-center text-xs sm:text-sm font-medium tracking-wide">
        FREE STANDARD SHIPPING ON ABOVE 499 ORDER
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-pink-600 uppercase tracking-tight">
                PAN<span className="text-pink-500 italic">ISHO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-pink-600 font-medium text-sm uppercase tracking-wide relative group transition-all duration-300"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Beauty Products Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('beauty')}
                className="flex items-center text-gray-800 hover:text-pink-600 font-medium text-sm uppercase tracking-wide relative focus:outline-none"
                aria-expanded={activeDropdown === 'beauty'}
                aria-haspopup="true"
              >
                Beauty Products
                <ChevronDown size={16} className="ml-1 transform transition-transform group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300" />
              </button>
              {activeDropdown === 'beauty' && (
                <div className="absolute left-0 mt-3 w-48 bg-white rounded-lg shadow-xl z-50 py-2 transform origin-top scale-95 transition-all duration-200 ease-out hover:scale-100">
                  {beautyProductsItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 text-sm capitalize transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Hair Products Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('hair')}
                className="flex items-center text-gray-800 hover:text-pink-600 font-medium text-sm uppercase tracking-wide relative focus:outline-none"
                aria-expanded={activeDropdown === 'hair'}
                aria-haspopup="true"
              >
                Hair Products
                <ChevronDown size={16} className="ml-1 transform transition-transform group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300" />
              </button>
              {activeDropdown === 'hair' && (
                <div className="absolute left-0 mt-3 w-48 bg-white rounded-lg shadow-xl z-50 py-2 transform origin-top scale-95 transition-all duration-200 ease-out hover:scale-100">
                  {hairProductsItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 text-sm capitalize transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-gray-800 hover:text-pink-600 font-medium text-sm uppercase tracking-wide relative group transition-all duration-300"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-pink-600 font-medium text-sm uppercase tracking-wide relative group transition-all duration-300"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/search"
              className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 hover:scale-110"
              aria-label="Search"
            >
              <Search size={20} />
            </Link>

            <Link
              to={user ? "/profile" : "/account"}
              className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200 hover:scale-110"
              aria-label="My Account"
            >
              <User size={20} />
            </Link>

            <Link
              to="/wishlist"
              className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 relative transition-all duration-200 hover:scale-110"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md transition-all duration-300">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="text-pink-600 hover:text-pink-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 relative transition-all duration-200 hover:scale-110"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              <CartCount />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg pt-4 pb-6 transition-all duration-300 ease-in-out">
          <div className="px-4 space-y-3 text-start">
            <Link
              to="/"
              className="block text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>

            {/* Beauty Products (mobile) */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-beauty')}
                className="flex items-center justify-between w-full text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
              >
                Beauty Products
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${activeDropdown === 'mobile-beauty' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'mobile-beauty' && (
                <div className="pl-6 mt-2 space-y-2 border-l-2 border-pink-200">
                  {beautyProductsItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block text-gray-700 hover:bg-pink-50 hover:text-pink-700 px-4 py-2 rounded-lg text-sm capitalize transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Hair Products (mobile) */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-hair')}
                className="flex items-center justify-between w-full text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
              >
                Hair Products
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${activeDropdown === 'mobile-hair' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'mobile-hair' && (
                <div className="pl-6 mt-2 space-y-2 border-l-2 border-pink-200">
                  {hairProductsItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block text-gray-700 hover:bg-pink-50 hover:text-pink-700 px-4 py-2 rounded-lg text-sm capitalize transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="block text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>

            <div className="pt-3 border-t border-gray-200">
              <Link
                to="/account"
                className="flex items-center text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
                onClick={toggleMenu}
              >
                <User size={18} className="mr-2" />
                My Account
              </Link>
              <Link
                to="/search"
                className="flex items-center text-gray-800 hover:bg-pink-50 hover:text-pink-600 px-4 py-2.5 rounded-lg font-medium text-sm uppercase tracking-wide transition-all duration-200"
                onClick={toggleMenu}
              >
                <Search size={18} className="mr-2" />
                Search
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;