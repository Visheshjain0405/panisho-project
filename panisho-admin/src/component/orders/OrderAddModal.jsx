import React, { useState } from 'react';

const OrderAddModal = ({ onClose, onAdd }) => {
  const [customer, setCustomer] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ customer, total, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-primary mb-4">Add Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-primary">
              Customer
            </label>
            <input
              type="text"
              id="customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="total" className="block text-sm font-medium text-primary">
              Total
            </label>
            <input
              type="text"
              id="total"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-primary">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
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

export default OrderAddModal;