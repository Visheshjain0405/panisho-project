import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUp, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 pt-16 pb-8 relative">
      {/* Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-pink-100"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12 py-8 px-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Join Our Newsletter</h3>
              <p className="text-gray-600">Stay updated with our latest products and special offers</p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-pink-600">
                PAN<span className="text-pink-500 italic">ISHO</span>
              </h2>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover premium hair care and beauty products at Panisho. We're committed to helping you look and feel your best with our carefully curated selection of high-quality products.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="text-pink-500 mr-3" />
                <span>(1800)-88-66-990</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="text-pink-500 mr-3" />
                <span>contact@panisho.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="text-pink-500 mr-3" />
                <span>123 Beauty Street, Fashion City, FC 10001</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="text-pink-500 mr-3" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Beauty Products Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-pink-200 text-gray-800">Beauty Products</h3>
            <ul className="space-y-3">
              <li>
                <a href="/beauty-products/facewash" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Facewash
                </a>
              </li>
              <li>
                <a href="/beauty-products/face-serum" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Face Serum
                </a>
              </li>
              <li>
                <a href="/beauty-products/sunscreen" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Sunscreen
                </a>
              </li>
              <li>
                <a href="/beauty-products/makeup" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Makeup
                </a>
              </li>
              <li>
                <a href="/beauty-products/body-care" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Body Care
                </a>
              </li>
            </ul>
          </div>

          {/* Hair Products Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-pink-200 text-gray-800">Hair Products</h3>
            <ul className="space-y-3">
              <li>
                <a href="/hair-products/shampoo" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Shampoo
                </a>
              </li>
              <li>
                <a href="/hair-products/conditioner" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Conditioner
                </a>
              </li>
              <li>
                <a href="/hair-products/beard-oil" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Beard Oil
                </a>
              </li>
              <li>
                <a href="/hair-products/treatments" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Hair Treatments
                </a>
              </li>
              <li>
                <a href="/hair-products/styling" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Styling Products
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-pink-200 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6 border-t border-pink-100">
          {/* Social Media */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="#" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Twitter size={20} />
            </a>
            <a href="#" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Youtube size={20} />
            </a>
            <a href="#" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Linkedin size={20} />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center md:justify-end">
            <div className="flex space-x-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <img src="/api/placeholder/50/30" alt="Visa" className="h-6" />
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <img src="/api/placeholder/50/30" alt="Mastercard" className="h-6" />
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <img src="/api/placeholder/50/30" alt="PayPal" className="h-6" />
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <img src="/api/placeholder/50/30" alt="Apple Pay" className="h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center border-t border-pink-100">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} <span className="font-bold text-pink-600">Panisho</span>. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-pink-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 focus:outline-none"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;