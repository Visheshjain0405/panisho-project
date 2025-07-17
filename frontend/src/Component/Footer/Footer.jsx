import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUp, Mail, Phone, MapPin, Clock } from 'lucide-react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [beautyLinks, setBeautyLinks] = useState([]);
  const [hairLinks, setHairLinks] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchFooterCategories = async () => {
      try {
        const res = await api.get('/navbar-categories');
        const data = res.data;

        const beauty = data
          .filter(item => item.navbarCategory === 'Beauty Products')
          .map(item => ({
            name: item.category.title,
            path: `/beauty-products/${item.category.slug}`,
          }));

        const hair = data
          .filter(item => item.navbarCategory === 'Hair Products')
          .map(item => ({
            name: item.category.title,
            path: `/hair-products/${item.category.slug}`,
          }));

        setBeautyLinks(beauty);
        setHairLinks(hair);
      } catch (err) {
        console.error('Failed to fetch footer categories', err);
      }
    };

    fetchFooterCategories();
  }, []);


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');

    try {
      const res = await api.post('/newsletter', { email });
      toast.success(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription failed';
      toast.error(msg);
    }
  };

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
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 ml-8">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src='https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png' alt="Panisho Logo" className="h-16 w-1/4 mr-3" />
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed text-start">
              Discover premium hair care and beauty products at Panisho. We're committed to helping you look and feel your best with our carefully curated selection of high-quality products.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="text-pink-500 mr-3" />
                <span>+91 8160467524</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="text-pink-500 mr-3" />
                <span>Support@panisho.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="text-pink-500 mr-3 text-start" />
                <span>31 Reva nagar near south zone office udhana Surat - 394210</span>
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
              {beautyLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center"
                  >
                    <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>


          </div>

          {/* Hair Products Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-pink-200 text-gray-800">Hair Products</h3>
            <ul className="space-y-3">
              {hairLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center"
                  >
                    <span className="h-1 w-1 rounded-full bg-pink-400 mr-2"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
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
            <a href="https://www.instagram.com/panisho.in?igsh=ZWE0bzV6NHk0d3c%3D&utm_source=qr" className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:bg-pink-50 transform hover:-translate-y-1 text-pink-500 hover:text-pink-600">
              <Instagram size={20} />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center md:justify-end mt-6">
            <div className="flex space-x-4">
              <div className="bg-white p-2 rounded-md shadow-md hover:scale-105 transition-transform">
                <FaCcVisa className="h-6 w-6 text-[#1a1f71]" title="Visa" />
              </div>
              <div className="bg-white p-2 rounded-md shadow-md hover:scale-105 transition-transform">
                <FaCcMastercard className="h-6 w-6 text-[#eb001b]" title="MasterCard" />
              </div>
              <div className="bg-white p-2 rounded-md shadow-md hover:scale-105 transition-transform">
                <FaCcPaypal className="h-6 w-6 text-[#003087]" title="PayPal" />
              </div>
              <div className="bg-white p-2 rounded-md shadow-md hover:scale-105 transition-transform">
                <FaApplePay className="h-6 w-6 text-black" title="Apple Pay" />
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