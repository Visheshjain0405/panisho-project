// src/components/products/ProductEditModal.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import api from '../../api/axiosInstance';

const ProductEditModal = ({ product, onClose, onEdit }) => {
  // Pre-fill state from the passed-in product
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [mrp, setMrp] = useState(product.mrp.toString());
  const [sellingPrice, setSellingPrice] = useState(product.sellingPrice.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [category, setCategory] = useState(product.category?._id || '');
  const [volume, setVolume] = useState(product.volume);
  const [skinHairType, setSkinHairType] = useState(product.skinHairType);
  const [targetAudience, setTargetAudience] = useState(product.targetAudience);
  const [ingredients, setIngredients] = useState(product.ingredients);
  const [usageInstructions, setUsageInstructions] = useState(product.usageInstructions);
  const [images, setImages] = useState([]); // newly uploaded files
  const [error, setError] = useState('');

  const [categories, setCategories] = useState([]);

  // Convert existing displayOptions object → array of {value,label}
  const initialDisplay = [];
  if (product.displayOptions.showOnHome) initialDisplay.push({ value: 'showOnHome', label: 'Show on Home Page' });
  if (product.displayOptions.trending)    initialDisplay.push({ value: 'trending', label: 'Trending Product' });
  if (product.displayOptions.mostSelling) initialDisplay.push({ value: 'mostSelling', label: 'Most Selling Product' });
  if (product.displayOptions.newArrival)  initialDisplay.push({ value: 'newArrival', label: 'New Arrival' });
  const [displayOptions, setDisplayOptions] = useState(initialDisplay);

  // Convert existing productTypes object → array of {value,label}
  const initialTypes = [];
  if (product.productTypes.organic)     initialTypes.push({ value: 'organic', label: 'Organic' });
  if (product.productTypes.sulfateFree) initialTypes.push({ value: 'sulfateFree', label: 'Sulfate-Free' });
  if (product.productTypes.parabenFree) initialTypes.push({ value: 'parabenFree', label: 'Paraben-Free' });
  if (product.productTypes.vegan)       initialTypes.push({ value: 'vegan', label: 'Vegan' });
  const [productTypes, setProductTypes] = useState(initialTypes);

  const displayOptionsList = [
    { value: 'showOnHome', label: 'Show on Home Page' },
    { value: 'trending', label: 'Trending Product' },
    { value: 'mostSelling', label: 'Most Selling Product' },
    { value: 'newArrival', label: 'New Arrival' },
  ];

  const productTypesList = [
    { value: 'organic', label: 'Organic' },
    { value: 'sulfateFree', label: 'Sulfate-Free' },
    { value: 'parabenFree', label: 'Paraben-Free' },
    { value: 'vegan', label: 'Vegan' },
  ];

  // Convert existing comma-separated product.keywords → array of {value,label}
  const keywordStrings = product.keywords || [];
  const initialKeywords = Array.isArray(keywordStrings)
    ? keywordStrings.map(str => ({ value: str, label: str }))
    : (product.keywords.split(',').map(str => ({ value: str.trim(), label: str.trim() })));
  const [keywords, setKeywords] = useState(initialKeywords);

  // For Skin/Hair Type and Target Audience
  const skinHairTypeOptions = [
    'Dry', 'Oily', 'Normal', 'Sensitive', 'Combination',
    'Curly', 'Straight', 'Wavy', 'Color-Treated', 'Damaged',
  ];
  const targetAudienceOptions = ['Men', 'Women', 'Unisex'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Handle uploading new images (max 4)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= 4) {
      setImages(prev => [...prev, ...files]);
    } else {
      alert('You can upload a maximum of 4 new images');
    }
  };

  // Submit edited product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      setError('Selling price cannot be greater than MRP');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('mrp', mrp);
    formData.append('sellingPrice', sellingPrice);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('volume', volume);
    formData.append('skinHairType', skinHairType);
    formData.append('targetAudience', targetAudience);
    formData.append('ingredients', ingredients);
    formData.append('usageInstructions', usageInstructions);

    // Convert multi-select arrays to simple arrays of values
    const displayValues = displayOptions.map(opt => opt.value);
    const typeValues = productTypes.map(opt => opt.value);
    const keywordValues = keywords.map(opt => opt.value);

    formData.append('displayOptions', JSON.stringify(displayValues));
    formData.append('productTypes', JSON.stringify(typeValues));
    formData.append('keywords', keywordValues.join(','));

    images.forEach(img => formData.append('images', img));

    try {
      const res = await api.put(`/products/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onEdit(res.data);
      onClose();
    } catch (err) {
      setError('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* MRP */}
          <div>
            <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-1">
              MRP (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="mrp"
              type="number"
              value={mrp}
              onChange={e => setMrp(e.target.value)}
              required
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="sellingPrice"
              type="number"
              value={sellingPrice}
              onChange={e => setSellingPrice(e.target.value)}
              required
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Volume */}
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
              Volume (e.g., 100ml) <span className="text-red-500">*</span>
            </label>
            <input
              id="volume"
              type="text"
              value={volume}
              onChange={e => setVolume(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Skin/Hair Type */}
          <div>
            <label htmlFor="skinHairType" className="block text-sm font-medium text-gray-700 mb-1">
              Skin/Hair Type <span className="text-red-500">*</span>
            </label>
            <select
              id="skinHairType"
              value={skinHairType}
              onChange={e => setSkinHairType(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Skin/Hair Type</option>
              {skinHairTypeOptions.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <select
              id="targetAudience"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Target Audience</option>
              {targetAudienceOptions.map(aud => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          {/* Display Options (react-select multi) */}
          <div className="md:col-span-2">
            <label htmlFor="displayOptions" className="block text-sm font-medium text-gray-700 mb-1">
              Display Options
            </label>
            <Select
              id="displayOptions"
              options={displayOptionsList}
              isMulti
              value={displayOptions}
              onChange={setDisplayOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select one or more..."
            />
          </div>

          {/* Product Types (react-select multi) */}
          <div className="md:col-span-2">
            <label htmlFor="productTypes" className="block text-sm font-medium text-gray-700 mb-1">
              Product Types
            </label>
            <Select
              id="productTypes"
              options={productTypesList}
              isMulti
              value={productTypes}
              onChange={setProductTypes}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select one or more..."
            />
          </div>

          {/* Ingredients */}
          <div className="md:col-span-2">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients (comma-separated) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Usage Instructions */}
          <div className="md:col-span-2">
            <label htmlFor="usageInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              Usage Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              id="usageInstructions"
              value={usageInstructions}
              onChange={e => setUsageInstructions(e.target.value)}
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Images (max 4 new) */}
          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images (up to 4)
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-300"
                >
                  {img.name}
                </span>
              ))}

              {/* Show existing images if no new ones chosen */}
              {images.length === 0 && product.images && product.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {product.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-md border border-gray-300"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Keywords (react-select creatable) */}
          <div className="md:col-span-2">
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (type and press Enter to create tags)
            </label>
            <CreatableSelect
              id="keywords"
              isMulti
              onChange={setKeywords}
              value={keywords}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Type a keyword, then press Enter..."
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
