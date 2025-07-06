import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';

const CategoryEditModal = ({ category, onClose, onEdit }) => {
  const [title, setTitle] = useState(category.title);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setTitle(category.title);
    setImage(null);
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.put(`/categories/${category._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onEdit(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-6">Edit Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primary">
              Category Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-primary">
              Category Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md text-primary"
            />
            {image ? (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-primary text-sm rounded">
                {image.name}
              </span>
            ) : category.image ? (
              <img
                src={category.image}
                alt="Current category"
                className="mt-2 w-12 h-12 object-cover rounded-md"
              />
            ) : (
              <span className="inline-block mt-2 text-primary">No Image</span>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-primary px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-secondary px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditModal;