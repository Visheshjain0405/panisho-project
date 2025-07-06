import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const HeroSlider = ({ currentSlide, setCurrentSlide }) => {
  const [backendSlides, setBackendSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Background overlays for image visibility
  const backgroundColors = ['bg-black/40', 'bg-gray-900/40', 'bg-neutral-900/40'];

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await api.get('/slider');
        const activeSlides = response.data
          .filter((slide) => slide.isActive)
          .sort((a, b) => a.order - b.order)
          .map((slide, index) => ({
            title: slide.title,
            subtitle: slide.description || 'Discover our latest collection',
            backgroundColor: backgroundColors[index % backgroundColors.length],
            cta: 'Shop Now',
            imageUrl: slide.imageUrl,
            clickUrl: slide.clickUrl || '#',
          }));
        setBackendSlides(activeSlides);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load slider images');
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Use backend slides only
  const activeSlides = backendSlides;

  // Auto slide with smooth transitions
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsTransitioning(false);
      }, 100);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length, setCurrentSlide, isPaused]);

  const handleSlideChange = (index) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 100);
  };

  if (loading) {
    return (
      <section className="relative h-screen bg-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
            <div className="text-xl font-semibold text-gray-600">Loading slides...</div>
          </div>
        </div>
      </section>
    );
  }

  if (activeSlides.length === 0) {
    return (
      <section className="relative h-screen bg-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-full px-4">
          <div className="max-w-lg text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-200">
            <div className="text-8xl mb-6 opacity-60">🌸</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Slides Available</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Create beautiful slides in the admin panel to showcase your content.
            </p>
            <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-500 text-lg">Preview Area</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = activeSlides[currentSlide] || activeSlides[0];

  return (
    <section
      className="relative h-screen overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentSlideData.imageUrl}?q=90&w=1920)` }}
        />
      </div>

      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${currentSlideData.backgroundColor} transition-all duration-1000`} />

      {/* Accent Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gray-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gray-600/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gray-400/5 rounded-full blur-xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-12">
        <div className={`max-w-6xl text-center transition-all duration-700 ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight text-white drop-shadow-2xl">
            {currentSlideData.title}
          </h1>
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-95 leading-relaxed max-w-3xl mx-auto font-light text-white drop-shadow-lg">
            {currentSlideData.subtitle}
          </p>
          {/* CTA Button */}
          <div className="flex justify-center">
            <a
              href={currentSlideData.clickUrl}
              className="group relative bg-gray-800 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gray-500/25"
            >
              <span className="relative z-10">{currentSlideData.cta}</span>
              <div className="absolute inset-0 bg-gray-700 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`relative transition-all duration-500 rounded-full overflow-hidden ${
              index === currentSlide
                ? 'w-16 h-4 bg-gray-400 shadow-2xl shadow-gray-500/30'
                : 'w-4 h-4 bg-gray-200/50 hover:bg-gray-300/80'
            }`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gray-300 opacity-50 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => handleSlideChange((currentSlide - 1 + activeSlides.length) % activeSlides.length)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-500/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-gray-500/30 transition-all duration-300 z-20 hover:scale-110 group border border-gray-300/30"
      >
        <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleSlideChange((currentSlide + 1) % activeSlides.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-500/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-gray-500/30 transition-all duration-300 z-20 hover:scale-110 group border border-gray-300/30"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pause Indicator */}
      {isPaused && (
        <div className="absolute top-6 right-6 bg-gray-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium z-20 border border-gray-300/30">
          ⏸️ Paused
        </div>
      )}

      <style jsx>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;