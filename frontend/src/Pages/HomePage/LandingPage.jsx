import React, { useState } from 'react';
import { Sparkles, Heart, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 md:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-pink-600">Panisho</h1>
        </div>
      
      </header>

      {/* Hero Section */}
      <main className="text-center px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Lotus Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-200 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-300 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Beauty & Hair Products
            <span className="block text-pink-500 mt-2">Coming Soon</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the perfect blend of nature and science for your beauty routine. 
            <span className="text-pink-500 font-semibold"> Launching this month!</span>
          </p>

          {/* Launch Badge */}
          <div className="inline-flex items-center space-x-2 bg-pink-100 px-6 py-3 rounded-full mb-12">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-pink-700 font-semibold">Expected Launch: July 2025</span>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto mb-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Be the first to know when we launch!
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
              <button
                onClick={handleSubmit}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Notify Me</span>
              </button>
            </div>
            {isSubmitted && (
              <p className="text-green-600 mt-3 animate-fade-in">
                Thank you! We'll notify you when we launch.
              </p>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Natural Ingredients</h3>
              <p className="text-gray-600">Carefully selected natural ingredients for healthy, beautiful hair and skin.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600">High-quality formulations that deliver real results for your beauty routine.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Care</h3>
              <p className="text-gray-600">Products developed with expert knowledge for all hair and skin types.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pink-50 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.instagram.com/panisho.in?igsh=ZWE0bzV6NHk0d3c%3D&utm_source=qr" className="text-pink-500 hover:text-pink-600 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
          <p className="text-gray-600 mb-2">© 2025 Panisho. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Beautiful hair and skin, naturally.</p>
        </div>
      </footer>
    </div>
  );
}