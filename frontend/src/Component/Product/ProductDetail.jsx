import React, { useState, useEffect } from 'react';
import { Star, Heart, Minus, Plus, ShoppingCart, CreditCard, Truck, Shield, Award, ChevronLeft, ChevronRight, Sparkles, Leaf, Check, MessageCircle, Camera, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from './ProductCard';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const ProductDetails = () => {
  const { slug } = useParams();
  console.log(slug)
  const { user } = useAuth();
  const userid = user?._id;
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        const productData = res.data; // ✅ define it once
        setProduct(productData);
        console.log(res.data)
        setSelectedVariant(productData.variants[0]);
        setIsWishlisted(wishlist.some(item => item._id === productData._id)); // Use product ID from fetched data
        // ✅ Fetch reviews only after product is loaded
        const reviewRes = await api.get(`/reviews/${productData._id}`);
        setReviews(reviewRes.data);


        // ✅ Now fetch similar products using the category
        if (productData.category?.slug) {
          fetchSimilarProducts(productData.category.slug, productData._id);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons');
        const activeCoupons = res.data.filter(coupon => coupon.isActive);
        setCoupons(activeCoupons);
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      }
    };

    const fetchSimilarProducts = async (categorySlug, currentProductId) => {
      try {
        const res = await api.get(`/products/category/${categorySlug}`);
        const filtered = res.data.filter(p => p._id !== currentProductId);
        setSimilarProducts(filtered);
        console.log(filtered)
      } catch (err) {
        console.error('Failed to fetch similar products:', err);
      }
    };


    fetchProduct();
    fetchCoupons();
  }, [slug, wishlist]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleImageChange = direction => {
    if (product?.images?.length) {
      if (direction === 'next') {
        setSelectedImage(prev => (prev + 1) % product.images.length);
      } else {
        setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
      }
    }
  };

  const handleQuantityChange = type => {
    if (type === 'increase' && quantity < selectedVariant?.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? 'fill-pink-400 text-pink-400' : 'text-gray-300'}`}
        aria-label={`${i + 1} star${i < rating ? ' filled' : ''}`}
      />
    ));
  };

  const handleReviewImageUpload = e => {
    const files = Array.from(e.target.files);
    if (newReview.images.length + files.length <= 4) {
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    } else {
      toast.error('You can upload a maximum of 4 images.');
    }
  };

  const removeReviewImage = index => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a review.');
      return;
    }

    if (!newReview.title || !newReview.comment) {
      toast.error('Please provide a title and comment for your review.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productId', product._id);
      formData.append('rating', newReview.rating);
      formData.append('title', newReview.title);
      formData.append('comment', newReview.comment);
      formData.append('userId', userid);

      newReview.images.forEach(image => {
        formData.append('images', image);
      });

      const res = await api.post(`/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setReviews(prev => [...prev, res.data]);
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setNewReview({ rating: 5, title: '', comment: '', images: [] });
    } catch (err) {
      toast.error('Failed to submit review.');
      console.error('Review submission error:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to your cart.');
      return;
    }

    if (!selectedVariant) {
      toast.error('Please select a variant.');
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity,
        variant: {
          sku: selectedVariant.sku,
          volume: selectedVariant.volume,
          volumeUnit: selectedVariant.volumeUnit,
          mrp: selectedVariant.mrp,
          sellingPrice: selectedVariant.sellingPrice,
          stock: selectedVariant.stock,
        }
      });

      toast.success('Product added to cart!');
    } catch (err) {
      toast.error('Failed to add product to cart.');
      console.error('Add to cart error:', err);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase.');
      return;
    }

    if (!selectedVariant) {
      toast.error('Please select a variant.');
      return;
    }

    const buyNowItem = {
      productId: product._id,
      quantity,
      product,
      variant: selectedVariant
    };

    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    navigate('/checkout');
  };


  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to manage your wishlist.');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist.');
      } else {
        await addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      toast.error('Failed to update wishlist.');
      console.error('Wishlist error:', err);
    }
  };

  const currentPrice = selectedVariant?.sellingPrice || 0;
  const originalPrice = selectedVariant?.mrp || 0;
  const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium text-sm sm:text-base">Loading beautiful products...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm sm:text-base">Product not found.</div>;
  }

  return (
    <HelmetProvider>
      <>
        {product && (
          <Helmet>
            <title>{product.name} | Panisho</title>
            <meta name="description" content={product.description?.slice(0, 150)} />
            <meta name="keywords" content={product.keywords?.join(', ')} />
            <link rel="canonical" href={`https://panisho.in/product/${product.slug}`} />

            {/* Open Graph */}
            <meta property="og:title" content={product.name} />
            <meta property="og:description" content={product.description?.slice(0, 150)} />
            <meta property="og:image" content={product.images?.[0]} />
            <meta property="og:url" content={`https://panisho.in/product/${product.slug}`} />
            <meta property="og:type" content="product" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={product.name} />
            <meta name="twitter:description" content={product.description?.slice(0, 150)} />
            <meta name="twitter:image" content={product.images?.[0]} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.name,
                image: product.images,
                description: product.description,
                sku: product.variants?.[0]?.sku || '',
                brand: {
                  "@type": "Brand",
                  name: "Panisho"
                },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: product.variants?.[0]?.sellingPrice,
                  availability: "https://schema.org/InStock",
                  url: `https://panisho.in/product/${product.slug}`
                }
              })}
            </script>
          </Helmet>
        )}


        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
          {/* Breadcrumb */}
          <div className="bg-white/80 backdrop-blur-sm py-3 sm:py-4 border-b border-pink-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="text-xs sm:text-sm text-gray-600 flex items-center space-x-2" aria-label="Breadcrumb">
                <a href="/" className="hover:text-pink-600">Home</a>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-pink-300" aria-hidden="true" />
                <span className="hover:text-pink-600 cursor-pointer">Beauty Products</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-pink-300" aria-hidden="true" />
                <span className="text-pink-600 font-medium">{product.name}</span>
              </nav>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Main Product Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 mb-12 lg:mb-16">
              {/* Image Gallery */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-transparent pointer-events-none"></div>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImage]}
                      alt={`${product.name} image ${selectedImage + 1}`}
                      className="w-full h-64 sm:h-96 lg:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-96 lg:h-[550px] bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-pink-300" aria-hidden="true" />
                    </div>
                  )}

                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageChange('prev')}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                      </button>
                      <button
                        onClick={() => handleImageChange('next')}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleWishlistToggle}
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg transition-all hover:scale-110"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600 hover:text-pink-500'}`} />
                  </button>

                  {discount > 0 && (
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 transition-all transform hover:scale-105 ${selectedImage === index
                          ? 'border-pink-500 ring-2 sm:ring-4 ring-pink-200 shadow-lg'
                          : 'border-transparent hover:border-pink-300 shadow-md'
                          }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-16 sm:h-20 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-transparent"></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">{product.name}</h1>

                  <div className="flex flex-wrap items-baseline space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">₹{currentPrice.toFixed(0)}</span>
                    {originalPrice && originalPrice !== currentPrice && (
                      <>
                        <span className="text-lg sm:text-xl lg:text-2xl text-gray-500 line-through">₹{originalPrice.toFixed(0)}</span>
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                          SAVE ₹{(originalPrice - currentPrice).toFixed(0)}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                    <div className="flex space-x-1">{renderStars(Math.round(averageRating), 'w-3 h-3 sm:w-4 sm:h-4')}</div>
                    <span className="text-gray-600 font-medium text-sm sm:text-base">
                      {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-pink-100">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 mr-2" aria-hidden="true" />
                    Exclusive Offers
                  </h3>
                  <div className="space-y-3">
                    {coupons.length > 0 ? (
                      <>
                        <div className="space-y-3 sm:space-y-4 text-start">
                          {coupons.slice(0, 3).map(coupon => (
                            <div key={coupon.code} className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div>
                                  <p className="font-bold text-base sm:text-lg">{coupon.code}</p>
                                  <p className="text-xs sm:text-sm opacity-90">
                                    {coupon.type === 'percentage'
                                      ? `${coupon.discount}% off`
                                      : `₹${coupon.discount} off`}
                                    {coupon.minPurchase ? ` on orders above ₹${coupon.minPurchase}` : ''}
                                  </p>
                                </div>
                                <button
                                  className="mt-2 sm:mt-0 bg-white text-pink-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-pink-50 transition-colors"
                                  onClick={() => {
                                    navigator.clipboard.writeText(coupon.code);
                                    toast.success(`${coupon.code} copied!`);
                                  }}
                                  aria-label={`Copy coupon code ${coupon.code}`}
                                >
                                  COPY
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {coupons.length > 3 && (
                          <button
                            onClick={() => setShowCouponModal(true)}
                            className="mt-3 sm:mt-4 text-pink-600 font-medium underline text-xs sm:text-sm hover:text-pink-700 transition-colors"
                            aria-label="View all coupon offers"
                          >
                            View All Offers
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">No active offers right now.</p>
                    )}
                  </div>
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Choose Size</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {product.variants.map(variant => (
                        <button
                          key={variant.sku}
                          onClick={() => setSelectedVariant(variant)}
                          className={`border-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 text-center transition-all transform hover:scale-105 ${selectedVariant?.sku === variant.sku
                            ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600 shadow-lg'
                            : 'border-gray-200 hover:border-pink-300 bg-white hover:shadow-md'
                            }`}
                          aria-label={`Select ${variant.volume}${variant.volumeUnit} variant`}
                        >
                          <div className="font-bold text-base sm:text-lg">{variant.volume}{variant.volumeUnit}</div>
                          <div className="text-xs sm:text-sm text-gray-500">₹{variant.sellingPrice.toFixed(0)}</div>
                          {variant.stock < 10 && (
                            <div className="text-xs text-red-500 mt-1">Only {variant.stock} left</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Quantity</h3>
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="flex items-center border-2 border-pink-200 rounded-xl sm:rounded-2xl bg-white shadow-sm">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="p-3 sm:p-4 hover:bg-pink-50 transition-colors rounded-l-xl sm:rounded-l-2xl"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                      </button>
                      <span className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        className="p-3 sm:p-4 hover:bg-pink-50 transition-colors rounded-r-xl sm:rounded-r-2xl"
                        disabled={quantity >= (selectedVariant?.stock || 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-base sm:text-lg">ADD TO CART</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3"
                    aria-label="Buy now"
                  >
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-base sm:text-lg">BUY NOW</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
                  <div className="space-y-3 sm:space-y-4 text-start">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-gray-900">Free Shipping</h4>
                        <p className="text-xs sm:text-sm text-gray-600">On orders above ₹499</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-2 sm:p-3">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-gray-900">Secure Payment</h4>
                        <p className="text-xs sm:text-sm text-gray-600">100% secure with Razorpay</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-2 sm:p-3">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-gray-900">Quality Assured</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Premium beauty products</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-12 lg:mb-16">
              <div className="border-b border-pink-100">
                <div className="flex flex-wrap">
                  {[
                    { key: 'description', label: 'Description', icon: Leaf },
                    { key: 'usageInstructions', label: 'How To Use', icon: Sparkles },
                    { key: 'ingredients', label: 'Ingredients', icon: Check },
                    { key: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageCircle },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-bold transition-all relative flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 ${activeTab === key
                        ? 'text-pink-600 bg-gradient-to-r from-pink-50 to-pink-100 border-b-4 border-pink-500'
                        : 'text-gray-700 hover:text-pink-600 hover:bg-pink-25'
                        }`}
                      aria-label={`View ${label}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 sm:p-8 lg:p-12">
                {activeTab === 'description' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                      <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                        <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Product Description</h3>
                    </div>
                    <div className="prose prose-sm sm:prose-lg max-w-none text-start">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-lg">{product.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'usageInstructions' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                      <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">How to Use</h3>
                    </div>
                    <div className="prose prose-sm sm:prose-lg max-w-none text-start">
                      {product.usageInstructions.split('\r\n').map((line, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed text-sm sm:text-lg">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'ingredients' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
                      <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                        <Check className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Key Ingredients</h3>
                    </div>
                    <div className="prose prose-sm sm:prose-lg max-w-none">
                      {product.ingredients.split('\r\n').map((line, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed text-sm sm:text-lg text-start">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Customer Reviews</h3>
                      </div>
                      <button
                        onClick={() => {
                          if (!user) {
                            toast.error('Please login to write a review.');
                          } else {
                            setShowReviewModal(true);
                          }
                        }}
                        className="mt-3 sm:mt-0 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 shadow-lg flex items-center space-x-1 sm:space-x-2"
                        aria-label="Write a review"
                      >
                        <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Write Review</span>
                      </button>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                      {reviews.length === 0 ? (
                        <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">No reviews for this product yet.</div>
                      ) : (
                        <>
                          {reviews.slice(0, visibleCount).map(review => (
                            <div
                              key={review._id}
                              className="bg-gradient-to-r from-pink-50/50 to-white border border-pink-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg"
                            >
                              <div className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 mb-4 sm:mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                    <h4 className="font-bold text-base sm:text-lg text-gray-900">
                                      {review.userId?.firstName} {review.userId?.lastName}
                                    </h4>
                                  </div>
                                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                                    <div className="flex space-x-1">{renderStars(review.rating, 'w-3 h-3 sm:w-4 sm:h-4')}</div>
                                    <span className="text-xs sm:text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <h5 className="font-bold text-base sm:text-lg text-gray-900 mb-3 text-start">{review.title}</h5>
                              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base text-start">{review.comment}</p>
                              {review.images?.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                  {review.images.map((img, index) => (
                                    <div
                                      key={index}
                                      className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                    >
                                      <img
                                        src={img}
                                        alt={`Review image ${index + 1}`}
                                        className="w-full h-20 sm:h-24 object-cover hover:scale-105 transition-transform cursor-pointer"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-transparent"></div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {review.adminReply && review.adminReply.message && (
                                <div className="bg-gradient-to-r from-pink-100/50 to-pink-50 border-l-4 border-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6">
                                  <div className="flex items-start space-x-2 sm:space-x-3">
                                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-full p-1 sm:p-2 flex-shrink-0">
                                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" aria-hidden="true" />
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
                                        <span className="font-bold text-sm sm:text-base text-pink-700">Panisho Team</span>
                                        <span className="text-xs text-pink-600 bg-pink-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Admin</span>
                                      </div>
                                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-start">
                                        {review.adminReply.message}
                                      </p>
                                      <span className="text-xs text-pink-600 mt-1 sm:mt-2 block">
                                        {new Date(review.adminReply.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {reviews.length > 3 && (
                            <div className="text-center mt-4 sm:mt-6">
                              {visibleCount < reviews.length ? (
                                <button
                                  onClick={() => setVisibleCount(prev => prev + 3)}
                                  className="text-pink-600 hover:underline font-semibold text-sm sm:text-base"
                                  aria-label="View more reviews"
                                >
                                  View more reviews
                                </button>
                              ) : (
                                <button
                                  onClick={() => setVisibleCount(3)}
                                  className="text-pink-600 hover:underline font-semibold text-sm sm:text-base"
                                  aria-label="Show fewer reviews"
                                >
                                  Show less
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-12 border border-pink-100">
              <div className="text-center mb-8 sm:mb-12">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Why Choose Panisho?</h2>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Your trusted partner in beauty and wellness, inspired by the purity of lotus</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Free Shipping</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Complimentary shipping on all orders above ₹499. Fast and secure delivery to your doorstep.</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">100% Secure</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Your payments are protected with bank-level security. Shop with complete confidence.</p>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Premium Quality</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Carefully curated products from trusted brands. Every product meets our high standards.</p>
                </div>
              </div>
            </div>

            {similarProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center">
                  You may also like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {similarProducts.map((product) => (
                    <ProductCard key={product._id} product={product} categorySlug={product?.category?.slug || 'unknown'} />
                  ))}
                </div>
              </div>
            )}


            {showReviewModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-2 sm:p-3">
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Write a Review</h3>
                      </div>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="text-gray-400 hover:text-pink-600 transition-colors"
                        aria-label="Close review modal"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 text-start">Rating *</label>
                        <div className="flex space-x-1 sm:space-x-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                              className="transition-transform hover:scale-110"
                              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              <Star
                                className={`w-6 h-6 sm:w-8 sm:h-8 ${star <= newReview.rating
                                  ? 'fill-pink-400 text-pink-400'
                                  : 'text-gray-300 hover:text-pink-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 text-start">Review Title *</label>
                        <input
                          type="text"
                          value={newReview.title}
                          onChange={e => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Summarize your experience..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-200 rounded-xl sm:rounded-2xl focus:border-pink-500 focus:outline-none transition-colors text-start"
                          aria-required="true"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 text-start">Review *</label>
                        <textarea
                          value={newReview.comment}
                          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your detailed experience with this product..."
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-pink-200 rounded-xl sm:rounded-2xl focus:border-pink-500 focus:outline-none transition-colors resize-none text-start"
                          aria-required="true"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 text-start">Add Photos (Optional)</label>
                        <div className="space-y-3 sm:space-y-4">
                          {newReview.images.length < 4 && (
                            <label className="block">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleReviewImageUpload}
                                className="hidden"
                                aria-label="Upload review images"
                              />
                              <div className="border-2 border-dashed border-pink-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:border-pink-500 hover:bg-pink-50/50 transition-all cursor-pointer">
                                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto mb-2 sm:mb-3" aria-hidden="true" />
                                <p className="text-gray-600 font-medium text-sm sm:text-base">
                                  Click to upload photos ({4 - newReview.images.length} remaining)
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Max 4 photos, up to 10MB each</p>
                              </div>
                            </label>
                          )}
                          {newReview.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                              {newReview.images.map((img, index) => {
                                const previewURL = typeof img === 'string' ? img : URL.createObjectURL(img);
                                return (
                                  <div key={index} className="relative group">
                                    <img
                                      src={previewURL}
                                      alt={`Upload ${index + 1}`}
                                      className="w-full h-20 sm:h-24 object-cover rounded-xl sm:rounded-2xl border-2 border-pink-200"
                                      onLoad={() => {
                                        if (typeof img !== 'string') URL.revokeObjectURL(previewURL);
                                      }}
                                    />
                                    <button
                                      onClick={() => removeReviewImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                      aria-label={`Remove image ${index + 1}`}
                                    >
                                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                        <button
                          onClick={() => setShowReviewModal(false)}
                          className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl sm:rounded-2xl hover:border-gray-400 transition-colors"
                          aria-label="Cancel review"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitReview}
                          disabled={!newReview.title || !newReview.comment}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                          aria-label="Submit review"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showCouponModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-br from-pink-50 to-white rounded-2xl sm:rounded-3xl shadow-2xl border border-pink-200">
                  <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6">
                    <h3 className="text-lg sm:text-2xl font-bold text-pink-600 text-start">🎁 All Coupon Offers</h3>
                    <button
                      onClick={() => setShowCouponModal(false)}
                      className="text-gray-400 hover:text-pink-600 transition-colors"
                      aria-label="Close coupon modal"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-4 max-h-[60vh] overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 custom-scroll">
                    {coupons.map(coupon => (
                      <div
                        key={coupon.code}
                        className="bg-white border border-pink-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between">
                          <div className="text-start">
                            <p className="font-bold text-base sm:text-base text-pink-700">{coupon.code}</p>
                            <p className="text-xs sm:text-sm text-pink-600 leading-snug mt-1">
                              {coupon.type === 'percentage'
                                ? `${coupon.discount}% off`
                                : `₹${coupon.discount} off`}
                              {coupon.minPurchase ? ` on orders above ₹${coupon.minPurchase}` : ''}
                            </p>
                          </div>
                          <button
                            className="mt-2 sm:mt-0 bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast.success(`${coupon.code} copied!`);
                            }}
                            aria-label={`Copy coupon code ${coupon.code}`}
                          >
                            COPY
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


      </>
    </HelmetProvider>

  );
};

export default ProductDetails;