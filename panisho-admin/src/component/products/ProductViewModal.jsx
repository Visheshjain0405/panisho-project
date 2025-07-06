import React from 'react';
import { X, Package, Droplets, Tag, Users, FileText, Star } from 'lucide-react';

const ProductViewModal = ({ product, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDisplayBadges = (displayOptions) => {
    const badges = [];
    if (displayOptions?.includes('trending')) badges.push({ label: 'Trending', color: 'bg-gray-200' });
    if (displayOptions?.includes('newArrival')) badges.push({ label: 'New', color: 'bg-gray-200' });
    if (displayOptions?.includes('showOnHome')) badges.push({ label: 'Featured', color: 'bg-gray-200' });
    if (displayOptions?.includes('mostSelling')) badges.push({ label: 'Best Seller', color: 'bg-gray-200' });
    return badges;
  };

  const getProductTypeBadges = (productTypes) => {
    const badges = [];
    if (productTypes?.includes('organic')) badges.push({ label: 'Organic', color: 'bg-gray-200' });
    if (productTypes?.includes('sulfateFree')) badges.push({ label: 'Sulfate-Free', color: 'bg-gray-200' });
    if (productTypes?.includes('parabenFree')) badges.push({ label: 'Paraben-Free', color: 'bg-gray-200' });
    if (productTypes?.includes('vegan')) badges.push({ label: 'Vegan', color: 'bg-gray-200' });
    return badges;
  };

  const discountPercentage = product.hasVariants
    ? Math.max(...product.variants.map((v) => Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100)))
    : Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);

  const totalStock = product.hasVariants
    ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
    : product.stock;

  const priceRange = product.hasVariants
    ? `${formatPrice(Math.min(...product.variants.map((v) => v.sellingPrice)))} - ${formatPrice(
        Math.max(...product.variants.map((v) => v.sellingPrice))
      )}`
    : formatPrice(product.sellingPrice);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-screen-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.category?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[0] || '/api/placeholder/600/400'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl border border-gray-200"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded text-sm font-bold">
                  {discountPercentage}% OFF
                </div>
              )}
              <div className="absolute top-4 right-4 bg-gray-200 text-black px-3 py-1 rounded text-sm font-medium">
                {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Pricing */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Pricing</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-black">{priceRange}</span>
                {!product.hasVariants && product.mrp !== product.sellingPrice && (
                  <span className="text-sm text-gray-500 line-through">MRP: {formatPrice(product.mrp)}</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.hasVariants && (
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Variants</h3>
                <div className="space-y-2">
                  {product.variants?.map((variant, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-black">
                          {variant.volume}{variant.volumeUnit}
                        </span>
                        <span className="text-sm text-gray-500">Stock: {variant.stock}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black">{formatPrice(variant.sellingPrice)}</div>
                        {variant.mrp !== variant.sellingPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(variant.mrp)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {getDisplayBadges(product.displayOptions || []).map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded text-sm font-medium bg-gray-200 text-black"
                  >
                    {badge.label}
                  </span>
                ))}
                {getProductTypeBadges(product.productTypes || []).map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded text-sm font-medium bg-gray-200 text-black"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Tag className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-black">Target Audience</p>
                    <p className="text-sm text-gray-600">{product.targetAudience}</p>
                  </div>
                </div>
                {!product.hasVariants && (
                  <div className="flex items-start space-x-2">
                    <Droplets className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-black">Volume</p>
                      <p className="text-sm text-gray-600">{product.volume}{product.volumeUnit}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-black">Description</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-black">Ingredients</p>
                    <p className="text-sm text-gray-600">{product.ingredients}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-black">Usage Instructions</p>
                    <p className="text-sm text-gray-600">{product.usageInstructions}</p>
                  </div>
                </div>
                {product.keywords?.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <Tag className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-black">Keywords</p>
                      <p className="text-sm text-gray-600">{product.keywords.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;