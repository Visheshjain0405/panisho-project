import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function NavbarCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [navbarCategories, setNavbarCategories] = useState([]);
  const [selectedNavbarCategory, setSelectedNavbarCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navbarCategoryOptions = [
    { value: 'Beauty Products', label: 'Beauty Products' },
    { value: 'Hair Products', label: 'Hair Products' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, navbarCatRes] = await Promise.all([
          api.get('/categories'),
          api.get('/navbar-categories'),
        ]);
        setCategories(catRes.data.map(cat => ({ value: cat.title, label: cat.title })));
        setNavbarCategories(navbarCatRes.data);
      } catch (error) {
        toast.error('Failed to load data');
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/navbar-categories', {
        navbarCategory: selectedNavbarCategory?.value,
        category: selectedCategory?.value,
      });
      const updated = await api.get('/navbar-categories');
      setNavbarCategories(updated.data);
      toast.success('Category added!');
      setIsModalOpen(false);
      setSelectedNavbarCategory(null);
      setSelectedCategory(null);
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Navbar Categories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Add
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Navbar Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {navbarCategories.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.navbarCategory}</td>
                    <td className="px-6 py-4">{item.category?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-sm bg-black text-white rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-black hover:text-gray-700">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button className="text-black hover:text-red-600">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {navbarCategories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No navbar categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add Navbar Category</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm">Navbar Category</label>
                  <Select
                    value={selectedNavbarCategory}
                    onChange={setSelectedNavbarCategory}
                    options={navbarCategoryOptions}
                    placeholder="Select navbar category"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm">Category</label>
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categories}
                    placeholder="Select a category"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default NavbarCategories;
