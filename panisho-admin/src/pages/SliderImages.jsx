import React, { useState, useEffect } from 'react';
import { Plus, Image, Edit2, Trash2, Eye, Upload, X, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

function SliderImages() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSlide, setEditSlide] = useState(null);

  const [newSlide, setNewSlide] = useState({
    title: '',
    description: '',
    clickUrl: '',
    imageFile: null,
  });

  // Fetch slider images from backend
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        setLoading(true);
        const response = await api.get('/slider');
        setSliderImages(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch slider images');
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliderImages();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (!['image/jpeg', 'image/png'].includes(files[0].type)) {
        toast.error('Only JPG/PNG images are allowed');
        return;
      }
      setSelectedFiles(files);
      setNewSlide({ ...newSlide, imageFile: files[0] });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (!['image/jpeg', 'image/png'].includes(files[0].type)) {
        toast.error('Only JPG/PNG images are allowed');
        return;
      }
      setSelectedFiles(files);
      setNewSlide({ ...newSlide, imageFile: files[0] });
    }
  };

  const handleUploadSlide = async () => {
    if (!newSlide.title || !newSlide.imageFile) {
      toast.error('Title and image are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', newSlide.title);
    formData.append('description', newSlide.description);
    formData.append('clickUrl', newSlide.clickUrl);
    formData.append('image', newSlide.imageFile);

    try {
      const response = await api.post('/slider/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSliderImages([...sliderImages, response.data]);
      toast.success('Slide uploaded successfully');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload slide');
      console.error('Error uploading slide:', error);
    }
  };

  const handleEditSlide = async () => {
    if (!editSlide.title) {
      toast.error('Title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', editSlide.title);
    formData.append('description', editSlide.description);
    formData.append('clickUrl', editSlide.clickUrl);
    if (editSlide.imageFile) {
      formData.append('image', editSlide.imageFile);
    }

    try {
      const response = await api.put(`/slider/update/${editSlide._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSliderImages(sliderImages.map((slide) => (slide._id === editSlide._id ? response.data : slide)));
      toast.success('Slide updated successfully');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update slide');
      console.error('Error updating slide:', error);
    }
  };

  const toggleSlideStatus = async (id) => {
    try {
      const slide = sliderImages.find((s) => s._id === id);
      const response = await api.put(`/slider/status/${id}`, { isActive: !slide.isActive });
      setSliderImages(sliderImages.map((s) => (s._id === id ? response.data : s)));
      toast.success(`Slide ${response.data.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle slide status');
      console.error('Error toggling slide status:', error);
    }
  };

  const deleteSlide = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await api.delete(`/slider/delete/${id}`);
        setSliderImages(sliderImages.filter((slide) => slide._id !== id));
        toast.success('Slide deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete slide');
        console.error('Error deleting slide:', error);
      }
    }
  };

  const startEdit = (slide) => {
    setEditSlide({
      _id: slide._id,
      title: slide.title,
      description: slide.description,
      clickUrl: slide.clickUrl,
      imageFile: null,
    });
    setSelectedFiles([]);
    setShowUploadModal(true);
  };

  const resetForm = () => {
    setNewSlide({ title: '', description: '', clickUrl: '', imageFile: null });
    setEditSlide(null);
    setSelectedFiles([]);
    setShowUploadModal(false);
    setDragActive(false);
  };

  const activeSlides = sliderImages.filter((s) => s.isActive).length;
  const totalSlides = sliderImages.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Slider Images</h1>
            <p className="text-gray-600">Manage homepage slider images and banners</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Eye size={20} />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus size={20} />
              Add Image
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Image size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{totalSlides}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <ToggleRight size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Slides</p>
                <p className="text-2xl font-bold text-gray-900">{activeSlides}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ToggleLeft size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Inactive Slides</p>
                <p className="text-2xl font-bold text-gray-900">{totalSlides - activeSlides}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Mode */}
        {previewMode && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Slider Preview</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                  {sliderImages.filter((s) => s.isActive).length > 0 ? (
                    <div className="relative h-64 bg-gray-200">
                      <img
                        src={sliderImages.filter((s) => s.isActive)[0]?.imageUrl}
                        alt="Slider preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-2xl font-bold mb-2">
                            {sliderImages.filter((s) => s.isActive)[0]?.title}
                          </h3>
                          <p className="text-lg">{sliderImages.filter((s) => s.isActive)[0]?.description}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-300 flex items-center justify-center">
                      <p className="text-gray-500">No active slides to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slider Images Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : sliderImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No slides available. Add a new slide to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sliderImages.map((slide) => (
              <div
                key={slide._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-transform hover:shadow-md"
              >
                <div className="relative">
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleSlideStatus(slide._id)}
                      className={`p-2 rounded-full ${
                        slide.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      } hover:opacity-90 transition-opacity`}
                      title={slide.isActive ? 'Deactivate slide' : 'Activate slide'}
                    >
                      {slide.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      #{slide.order}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{slide.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{slide.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar size={12} />
                    {new Date(slide.uploadDate).toLocaleDateString()}
                  </div>
                  {slide.clickUrl && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Click URL:</p>
                      <a
                        href={slide.clickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 truncate hover:underline"
                      >
                        {slide.clickUrl}
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(slide)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit slide"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteSlide(slide._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete slide"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload/Edit Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editSlide ? 'Edit Slide' : 'Add New Slider Image'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                {/* Image Upload Area */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Slider Image *</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {selectedFiles.length > 0 ? (
                      <div>
                        <img
                          src={URL.createObjectURL(selectedFiles[0])}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg mb-4 object-cover"
                        />
                        <p className="text-sm text-gray-600 truncate">{selectedFiles[0].name}</p>
                      </div>
                    ) : editSlide && !selectedFiles.length ? (
                      <div>
                        <img
                          src={editSlide.imageUrl}
                          alt="Current"
                          className="max-h-48 mx-auto rounded-lg mb-4 object-cover"
                        />
                        <p className="text-sm text-gray-600">Upload a new image to replace</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Drag and drop your image here, or</p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          Browse Files
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Recommended: 1920x800px, JPG/PNG, max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Form Fields */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Slide Title *</label>
                  <input
                    type="text"
                    value={editSlide ? editSlide.title : newSlide.title}
                    onChange={(e) =>
                      editSlide
                        ? setEditSlide({ ...editSlide, title: e.target.value })
                        : setNewSlide({ ...newSlide, title: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter slide title"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Description</label>
                  <textarea
                    value={editSlide ? editSlide.description : newSlide.description}
                    onChange={(e) =>
                      editSlide
                        ? setEditSlide({ ...editSlide, description: e.target.value })
                        : setNewSlide({ ...newSlide, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Enter slide description"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Click URL (Optional)</label>
                  <input
                    type="url"
                    value={editSlide ? editSlide.clickUrl : newSlide.clickUrl}
                    onChange={(e) =>
                      editSlide
                        ? setEditSlide({ ...editSlide, clickUrl: e.target.value })
                        : setNewSlide({ ...newSlide, clickUrl: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={editSlide ? handleEditSlide : handleUploadSlide}
                  disabled={editSlide ? !editSlide.title : !newSlide.title || !newSlide.imageFile}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {editSlide ? 'Update Slide' : 'Upload Slide'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SliderImages;