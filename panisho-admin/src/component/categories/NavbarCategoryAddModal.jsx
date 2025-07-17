import React, { useState } from 'react';
import Select from 'react-select';
import api from '../../api/axiosInstance';

const NavbarCategoryAddModal = ({ onClose, selectedCategoryType, setSelectedCategoryType }) => {
  const categoryOptions = [
    { value: 'beauty', label: 'Beauty Products' },
    { value: 'hair', label: 'Hair Products' }
  ];

  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryType || !title) return;

    try {
      const response = await api.post('/navbar-categories', {
        title,
        type: selectedCategoryType.value
      });
      onClose();
    } catch (error) {
      console.error('Error adding navbar category:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-6">Add Navbar Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="categoryType" className="block text-sm font-medium text-primary">
              Category Type
            </label>
            <Select
              id="categoryType"
              options={categoryOptions}
              value={selectedCategoryType}
              onChange={setSelectedCategoryType}
              placeholder="Select category type"
              className="mt-1"
            />
          </div>
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NavbarCategoryAddModal;