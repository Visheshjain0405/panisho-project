import React, { useState, useEffect } from 'react';
import {
  Upload,
  X,
  Plus,
  Package,
  Tag,
  Droplets,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Save,
  FileText,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../api/axiosInstance';

const AddProductForm = ({ editMode = false, initialData = null, onClose, onAdd }) => {
  // Basic Product Information
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mrp: '',
    sellingPrice: '',
    stock: '',
    category: '',
    volume: '',
    volumeUnit: 'ml',
    targetAudience: '',
    ingredients: '',
    usageInstructions: ''
  });

  // Advanced Options
  const [displayOptions, setDisplayOptions] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  // Product Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([
    { volume: '', volumeUnit: 'ml', mrp: '', sellingPrice: '', stock: '', sku: '' }
  ]);

  // Images
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // UI State
  const [activeSection, setActiveSection] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        console.log('✅ Categories fetched:', response.data);
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []); // ✅ Only once on mount

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        mrp: initialData.mrp || '',
        sellingPrice: initialData.sellingPrice || '',
        stock: initialData.stock || '',
        category: initialData.category?._id || '',
        volume: initialData.volume || '',
        volumeUnit: initialData.volumeUnit || 'ml',
        targetAudience: initialData.targetAudience || '',
        ingredients: initialData.ingredients || '',
        usageInstructions: initialData.usageInstructions || ''
      });

      setHasVariants(initialData.hasVariants || false);
      setVariants(initialData.variants || []);
      setDisplayOptions(initialData.displayOptions || []);
      setProductTypes(initialData.productTypes || []);
      setKeywords(initialData.keywords || []);
      setImages([]); // for new uploads
      setPreviews(initialData.images || []);
    }
  }, [editMode, initialData]);


  // Options
  const volumeOptions = [
    { value: '50', unit: 'ml' },
    { value: '100', unit: 'ml' },
    { value: '150', unit: 'ml' },
    { value: '200', unit: 'ml' },
    { value: '250', unit: 'ml' },
    { value: '500', unit: 'ml' },
    { value: '1', unit: 'L' }
  ];

  const skinHairTypeOptions = [
    'All Types', 'Dry', 'Oily', 'Normal', 'Sensitive', 'Combination',
    'Curly', 'Straight', 'Wavy', 'Color-Treated', 'Damaged'
  ];

  const targetAudienceOptions = ['Men', 'Women', 'Unisex', 'Kids', 'Teens'];

  const displayOptionsList = [
    { value: 'showOnHome', label: 'Show on Home Page', icon: '🏠' },
    { value: 'trending', label: 'Trending Product', icon: '🔥' },
    { value: 'mostSelling', label: 'Most Selling Product', icon: '💰' },
    { value: 'newArrival', label: 'New Arrival', icon: '✨' },
    { value: 'featured', label: 'Featured Product', icon: '⭐' }
  ];

  const productTypesList = [
    { value: 'organic', label: 'Organic', icon: '🌿' },
    { value: 'sulfateFree', label: 'Sulfate-Free', icon: '🚫' },
    { value: 'parabenFree', label: 'Paraben-Free', icon: '🛡️' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'crueltyfree', label: 'Cruelty-Free', icon: '🐰' },
    { value: 'natural', label: 'Natural', icon: '🍃' }
  ];

  const sections = [
    { id: 'basic', title: 'Basic Info', icon: Package, color: 'blue' },
    { id: 'variants', title: 'Variants', icon: Droplets, color: 'cyan' },
    { id: 'details', title: 'Details', icon: FileText, color: 'purple' },
    { id: 'images', title: 'Images', icon: Camera, color: 'pink' },
    { id: 'advanced', title: 'Advanced', icon: Star, color: 'orange' }
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset type when category changes
    if (field === 'category') {
      setFormData(prev => ({ ...prev, type: '' }));
    }
  };

  // Handle volume selection
  const handleVolumeSelect = (volume, unit) => {
    setFormData(prev => ({
      ...prev,
      volume: volume,
      volumeUnit: unit
    }));
  };

  // Add/Remove variants
  const addVariant = () => {
    setVariants(prev => [...prev, {
      volume: '',
      volumeUnit: 'ml',
      mrp: '',
      sellingPrice: '',
      stock: '',
      sku: ''
    }]);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  // Handle image upload
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    if (images.length + previews.length + fileArray.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...fileArray]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  // Remove keyword
  const removeKeyword = (keyword) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  // Toggle options
  const toggleOption = (value, setter, currentArray) => {
    setter(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    // Validate variants
    if (hasVariants) {
      variants.forEach((variant, index) => {
        if (!variant.volume) newErrors[`variant_${index}_volume`] = `Variant ${index + 1} volume is required`;
        if (!variant.mrp || parseFloat(variant.mrp) <= 0) newErrors[`variant_${index}_mrp`] = `Variant ${index + 1} MRP is required`;
        if (!variant.sellingPrice || parseFloat(variant.sellingPrice) <= 0) newErrors[`variant_${index}_sellingPrice`] = `Variant ${index + 1} selling price is required`;
        if (parseFloat(variant.sellingPrice) > parseFloat(variant.mrp)) newErrors[`variant_${index}_sellingPrice`] = `Variant ${index + 1} selling price cannot exceed MRP`;
        if (!variant.stock || parseInt(variant.stock) < 0) newErrors[`variant_${index}_stock`] = `Variant ${index + 1} stock is required`;
      });
    } else {
      if (!formData.mrp || parseFloat(formData.mrp) <= 0) newErrors.mrp = 'Valid MRP is required';
      if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) newErrors.sellingPrice = 'Valid selling price is required';
      if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) newErrors.sellingPrice = 'Selling price cannot exceed MRP';
      if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
      if (!formData.volume) newErrors.volume = 'Volume is required';
    }

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.targetAudience) newErrors.targetAudience = 'Target audience is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.usageInstructions.trim()) newErrors.usageInstructions = 'Usage instructions are required';
    if (images.length === 0 && previews.length === 0) {
      newErrors.images = 'At least one image is required';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();

      // append fields as before
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('category', formData.category);
      form.append('volume', formData.volume);
      form.append('volumeUnit', formData.volumeUnit);
      form.append('targetAudience', formData.targetAudience);
      form.append('ingredients', formData.ingredients);
      form.append('usageInstructions', formData.usageInstructions);
      form.append('hasVariants', hasVariants ? 'true' : 'false');

      if (hasVariants) {
        const cleanedVariants = variants.map(v => ({
          volume: v.volume,
          volumeUnit: v.volumeUnit,
          mrp: parseFloat(v.mrp) || 0,
          sellingPrice: parseFloat(v.sellingPrice) || 0,
          stock: parseInt(v.stock) || 0,
          sku: v.sku || ''
        }));
        form.append('variants', JSON.stringify(cleanedVariants));
      }
      else {
        form.append('mrp', formData.mrp);
        form.append('sellingPrice', formData.sellingPrice);
        form.append('stock', formData.stock);
      }

      keywords.forEach(k => form.append('keywords[]', k));
      displayOptions.forEach(d => form.append('displayOptions[]', d));
      productTypes.forEach(p => form.append('productTypes[]', p));
      images.forEach(file => form.append('images', file));

      if (editMode && initialData?._id) {
        await api.put(`/products/${initialData._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onAdd?.(); // refresh list
      onClose?.(); // close modal
    } catch (err) {
      console.error('❌ Error submitting product:', err);
      alert('Error while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };





  // Calculate discount percentage for single product
  const discountPercentage = !hasVariants && formData.mrp && formData.sellingPrice
    ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
    : 0;

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter product name (e.g., Herbal Revive Shampoo)"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your product features and benefits..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.description.length}/500 characters</p>
      </div>
    </div>
  );

  const renderVariants = () => (
    <div className="space-y-6">
      {/* Variant Toggle */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-100">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-cyan-800">Product Variants</h3>
            <p className="text-sm text-cyan-600">Add different sizes or packaging for this product</p>
          </div>
          <div
            onClick={() => {
              const toggleValue = !hasVariants;
              setHasVariants(toggleValue);

              if (toggleValue) {
                // Only reset variants if not in edit mode or if variants are empty
                if (!editMode || !initialData?.variants || initialData.variants.length === 0) {
                  setVariants([{ volume: '', volumeUnit: 'ml', mrp: '', sellingPrice: '', stock: '', sku: '' }]);
                }

                // Reset flat pricing fields only if not editing
                if (!editMode) {
                  setFormData(prev => ({
                    ...prev,
                    mrp: '',
                    sellingPrice: '',
                    stock: '',
                    volume: '',
                    volumeUnit: 'ml',
                  }));
                }
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${hasVariants ? 'bg-cyan-600' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasVariants ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
            <Droplets className="w-8 h-8 text-cyan-600" />
            <div>
              <p className="font-medium text-gray-800">Multiple Sizes</p>
              <p className="text-xs text-gray-600">100ml, 200ml, 500ml etc.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
            <Tag className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">Different Pricing</p>
              <p className="text-xs text-gray-600">Per variant pricing</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl">
            <Package className="w-8 h-8 text-purple-600" />
            <div>
              <p className="font-medium text-gray-800">Separate Stock</p>
              <p className="text-xs text-gray-600">Track inventory per variant</p>
            </div>
          </div>
        </div>
      </div>

      {hasVariants && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Product Variants</h4>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-800">Variant {index + 1}</h5>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.volume}
                      onChange={(e) => updateVariant(index, 'volume', e.target.value)}
                      placeholder="100"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${errors[`variant_${index}_volume`] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors[`variant_${index}_volume`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_volume`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      value={variant.volumeUnit}
                      onChange={(e) => updateVariant(index, 'volumeUnit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    >
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.mrp}
                      onChange={(e) => updateVariant(index, 'mrp', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${errors[`variant_${index}_mrp`] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors[`variant_${index}_mrp`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_mrp`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.sellingPrice}
                      onChange={(e) => updateVariant(index, 'sellingPrice', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${errors[`variant_${index}_sellingPrice`] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors[`variant_${index}_sellingPrice`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_sellingPrice`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                      placeholder="0"
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${errors[`variant_${index}_stock`] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors[`variant_${index}_stock`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_stock`]}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU (Optional)
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="e.g., FW-100ML-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                {variant.mrp && variant.sellingPrice && parseFloat(variant.sellingPrice) < parseFloat(variant.mrp) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        {Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );


  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Target Audience <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.targetAudience}
          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${errors.targetAudience ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        >
          <option value="">Select audience</option>
          {targetAudienceOptions.map(audience => (
            <option key={audience} value={audience}>{audience}</option>
          ))}
        </select>
        {errors.targetAudience && <p className="mt-1 text-sm text-red-600">{errors.targetAudience}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ingredients <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => handleInputChange('ingredients', e.target.value)}
          placeholder="List all ingredients (comma-separated)"
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none ${errors.ingredients ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Usage Instructions <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.usageInstructions}
          onChange={(e) => handleInputChange('usageInstructions', e.target.value)}
          placeholder="How to use this product..."
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none ${errors.usageInstructions ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.usageInstructions && <p className="mt-1 text-sm text-red-600">{errors.usageInstructions}</p>}
      </div>
    </div>
  );

  const renderImages = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Images <span className="text-red-500">*</span>
          <span className="text-gray-500 font-normal">(Maximum 4 images)</span>
        </label>

        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
            ? 'border-pink-400 bg-pink-50'
            : errors.images
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={images.length >= 4}
          />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {images.length >= 4 ? 'Maximum images reached' : 'Drop images here or click to upload'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
            </div>
          </div>
        </div>

        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
      </div>

      {previews.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Uploaded Images ({previews.length}/4)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Display Options
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayOptionsList.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value, setDisplayOptions, displayOptions)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${displayOptions.includes(option.value)
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Product Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {productTypesList.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => toggleOption(type.value, setProductTypes, productTypes)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${productTypes.includes(type.value)
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
            >
              <div className="text-lg mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Keywords
        </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            placeholder="Add keyword..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-pink-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-gray-600">
                {editMode ? 'Update the existing product information' : 'Create a new product for your store'}
              </p>

            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                const hasError = Object.keys(errors).some(key => {
                  if (section.id === 'basic') return ['name', 'description'].includes(key);
                  if (section.id === 'variants') return key.startsWith('variant_') || ['mrp', 'sellingPrice', 'stock', 'volume'].includes(key);
                  if (section.id === 'details') return ['category', 'type', 'skinHairType', 'targetAudience', 'ingredients', 'usageInstructions'].includes(key);
                  if (section.id === 'images') return key === 'images';
                  return false;
                });

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${isActive
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{section.title}</span>
                    {hasError && (
                      <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Progress Indicator */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Completion Status</h4>
              <div className="space-y-2">
                {sections.map((section) => {
                  let isComplete = false;
                  if (section.id === 'basic') isComplete = formData.name && formData.description;
                  if (section.id === 'variants') {
                    if (hasVariants) {
                      isComplete = variants.length > 0 && variants.every(v => v.volume && v.mrp && v.sellingPrice && v.stock);
                    } else {
                      isComplete = formData.mrp && formData.sellingPrice && formData.stock && formData.volume;
                    }
                  }
                  if (section.id === 'details') isComplete = formData.category && formData.type && formData.skinHairType && formData.targetAudience && formData.ingredients && formData.usageInstructions;
                  if (section.id === 'images') isComplete = images.length > 0;
                  if (section.id === 'advanced') isComplete = true; // Optional section

                  return (
                    <div key={section.id} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={`text-sm ${isComplete ? 'text-green-700' : 'text-gray-600'}`}>
                        {section.title}
                      </span>
                      {isComplete && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl">
                {/* Section Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-2">
                    {React.createElement(sections.find(s => s.id === activeSection)?.icon || Package, {
                      className: "w-6 h-6 text-blue-600"
                    })}
                    <h3 className="text-xl font-bold text-gray-800">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {activeSection === 'basic' && 'Enter the basic information about your product'}
                    {activeSection === 'variants' && (hasVariants ? 'Set up multiple product variants with different sizes and pricing' : 'Configure pricing and inventory for single product')}
                    {activeSection === 'details' && 'Specify product category, type, and usage information'}
                    {activeSection === 'images' && 'Upload high-quality product images'}
                    {activeSection === 'advanced' && 'Configure display options and marketing features'}
                  </p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit}>
                  {activeSection === 'basic' && renderBasicInfo()}
                  {activeSection === 'variants' && renderVariants()}
                  {activeSection === 'details' && renderDetails()}
                  {activeSection === 'images' && renderImages()}
                  {activeSection === 'advanced' && renderAdvanced()}
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Auto-saved</span>
                  </div>
                  {Object.keys(errors).length > 0 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{Object.keys(errors).length} error(s) to fix</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Navigation Buttons */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(sections[currentIndex - 1].id);
                        }
                      }}
                      disabled={sections.findIndex(s => s.id === activeSection) === 0}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === activeSection);
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1].id);
                        }
                      }}
                      disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium flex items-center space-x-2 transition-all ${isSubmitting
                        ? 'opacity-75 cursor-not-allowed'
                        : 'hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Adding Product...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>{editMode ? 'Update Product' : 'Add Product'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;