import React, { useState, useEffect } from 'react';
import CategoryAddModal from './CategoryAddModal';
import CategoryEditModal from './CategoryEditModal';
import api from '../../api/axiosInstance';

const CategoryDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (updatedCategory) => {
    setCategories(
      categories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      )
    );
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-secondary px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr,auto,auto] gap-4 bg-gray-100 rounded-md p-4">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-subgrid col-span-full bg-primary text-secondary rounded-t-md">
            <div className="p-3 text-left text-sm font-semibold">Category ID</div>
            <div className="p-3 text-left text-sm font-semibold">Title</div>
            <div className="p-3 text-left text-sm font-semibold">Image</div>
            <div className="p-3 text-left text-sm font-semibold">Actions</div>
          </div>
          {/* Body */}
          {categories.map((category) => (
            <div
              key={category._id}
              className="grid grid-cols-1 sm:grid-cols-subgrid col-span-full border-b border-gray-200 last:border-b-0 sm:bg-white sm:rounded-md"
            >
              <div className="p-3 text-primary flex sm:block">
                <span className="sm:hidden font-semibold mr-2">ID:</span>
                {category._id}
              </div>
              <div className="p-3 text-primary flex sm:block">
                <span className="sm:hidden font-semibold mr-2">Title:</span>
                {category.title}
              </div>
              <div className="p-3">
                <span className="sm:hidden font-semibold mr-2">Image:</span>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-12 h-12 object-cover rounded-md inline-block"
                  />
                ) : (
                  <span className="text-primary">No Image</span>
                )}
              </div>
              <div className="p-3 flex sm:block space-x-2 sm:space-x-0">
                <span className="sm:hidden font-semibold mr-2">Actions:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="bg-primary text-secondary px-3 py-1 rounded-md hover:bg-gray-800 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isAddModalOpen && (
        <CategoryAddModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCategory}
        />
      )}
      {isEditModalOpen && selectedCategory && (
        <CategoryEditModal
          category={selectedCategory}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditCategory}
        />
      )}
    </div>
  );
};

export default CategoryDisplay;