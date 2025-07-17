import React, { useState } from 'react';
import {
  X,
  Star,
  Package,
  Tag,
  Users,
  Leaf,
  Heart,
  Shield,
  Droplets,
  Info,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

const ProductViewModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedSku, setCopiedSku] = useState('');

  if (!product) return null;

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDisplayBadges = (displayOptions) => {
    const badgeConfig = {
      trending: { label: 'Trending', icon: TrendingUp, color: 'bg-orange-100 text-orange-800' },
      newArrival: { label: 'New Arrival', icon: Zap, color: 'bg-green-100 text-green-800' },
      showOnHome: { label: 'Featured', icon: Star, color: 'bg-purple-100 text-purple-800' },
      mostSelling: { label: 'Best Seller', icon: Award, color: 'bg-blue-100 text-blue-800' }
    };
    
    return (displayOptions || []).map(option => badgeConfig[option]).filter(Boolean);
  };

  const getProductTypeBadges = (productTypes) => {
    const typeConfig = {
      organic: { label: 'Organic', icon: Leaf, color: 'bg-green-100 text-green-800' },
      sulfateFree: { label: 'Sulfate-Free', icon: Droplets, color: 'bg-blue-100 text-blue-800' },
      parabenFree: { label: 'Paraben-Free', icon: Shield, color: 'bg-purple-100 text-purple-800' },
      vegan: { label: 'Vegan', icon: Heart, color: 'bg-pink-100 text-pink-800' }
    };
    
    return (productTypes || []).map(type => typeConfig[type]).filter(Boolean);
  };

  const totalStock = product.variants?.length
    ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
    : 0;

  const priceRange = product.variants?.length
    ? {
        min: Math.min(...product.variants.map(v => v.sellingPrice)),
        max: Math.max(...product.variants.map(v => v.sellingPrice))
      }
    : null;

  const maxDiscount = product.variants?.length
    ? Math.max(...product.variants.map(v => Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100)))
    : 0;

  const handleCopySku = (sku) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(''), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (product.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images?.length - 1) : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Product Details</h2>
              <p className="text-gray-300">Complete product information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Images and Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img
                  src={product.images?.[currentImageIndex] || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount Badge */}
                {maxDiscount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-lg shadow-lg">
                    {maxDiscount}% OFF
                  </div>
                )}

                {/* Stock Status */}
                <div className={`absolute top-4 right-4 px-3 py-2 rounded-lg font-medium shadow-lg ${
                  totalStock > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {totalStock > 0 ? `${totalStock} In Stock` : 'Out of Stock'}
                </div>

                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images?.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-gray-800 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Keywords Tags */}
              {product.keywords?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getDisplayBadges(product.displayOptions).map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {badge.label}
                      </span>
                    );
                  })}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.category?.title || 'Uncategorized'}</p>

                {/* Price Range */}
                {priceRange && (
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {priceRange.min === priceRange.max 
                        ? formatPrice(priceRange.min)
                        : `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
                      }
                    </div>
                    <p className="text-sm text-gray-500">Price range across all variants</p>
                  </div>
                )}

                {/* Product Type Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {getProductTypeBadges(product.productTypes).map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${badge.color}`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.targetAudience && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">Target Audience</h4>
                    </div>
                    <p className="text-gray-700">{product.targetAudience}</p>
                  </div>
                )}

                {product.skinHairType && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Droplets className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">Skin/Hair Type</h4>
                    </div>
                    <p className="text-gray-700">{product.skinHairType}</p>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Ingredients
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
                </div>
              )}

              {/* Usage Instructions */}
              {product.usageInstructions && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Usage Instructions
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.usageInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Variants Section */}
          {product.variants?.length > 0 && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  Product Variants ({product.variants.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.variants.map((variant, index) => {
                    const discountPercent = Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100);
                    
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">
                              {variant.volume}{variant.volumeUnit}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <button
                                onClick={() => handleCopySku(variant.sku)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors"
                                title="Click to copy SKU"
                              >
                                <span>SKU: {variant.sku}</span>
                                {copiedSku === variant.sku ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          {discountPercent > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Selling Price:</span>
                            <span className="font-bold text-lg text-gray-900">
                              {formatPrice(variant.sellingPrice)}
                            </span>
                          </div>
                          
                          {variant.mrp !== variant.sellingPrice && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">MRP:</span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(variant.mrp)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Stock:</span>
                            <span className={`font-medium ${
                              variant.stock > 10 
                                ? 'text-green-600' 
                                : variant.stock > 0 
                                  ? 'text-orange-600' 
                                  : 'text-red-600'
                            }`}>
                              {variant.stock} units
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className={`w-full h-2 rounded-full ${
                            variant.stock > 20 
                              ? 'bg-green-200' 
                              : variant.stock > 5 
                                ? 'bg-orange-200' 
                                : 'bg-red-200'
                          }`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                variant.stock > 20 
                                  ? 'bg-green-500' 
                                  : variant.stock > 5 
                                    ? 'bg-orange-500' 
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((variant.stock / 30) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Stock Level: {variant.stock > 20 ? 'High' : variant.stock > 5 ? 'Medium' : 'Low'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="px-6 pb-6">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product ID:</span>
                  <p className="font-medium text-gray-900">{product._id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Slug:</span>
                  <p className="font-medium text-gray-900">{product.slug}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;