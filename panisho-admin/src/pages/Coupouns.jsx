import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Percent, Tag } from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const defaultCouponState = {
    code: '',
    description: '',
    discount: '',
    type: 'percentage',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    userLimit: '',
  };

  const [newCoupon, setNewCoupon] = useState(defaultCouponState);
  const [editCoupon, setEditCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async () => {
    const { code, discount, type } = newCoupon;
    if (!code || !discount || !type) return alert('Fill all required fields');

    try {
      await api.post('/coupons', {
        ...newCoupon,
        discount: parseFloat(newCoupon.discount),
        minPurchase: newCoupon.minPurchase ? parseFloat(newCoupon.minPurchase) : null,
        maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : null,
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
        userLimit: newCoupon.userLimit ? parseInt(newCoupon.userLimit) : null,
      });
      setShowAddModal(false);
      setNewCoupon(defaultCouponState);
      fetchCoupons();
    } catch (err) {
      console.error('Error adding coupon:', err);
      alert('Failed to add coupon');
    }
  };

  const handleEditCoupon = async () => {
    if (!editCoupon.code || !editCoupon.discount || !editCoupon.type) {
      return alert('Fill all required fields');
    }

    try {
      await api.put(`/coupons/${editCoupon._id}`, {
        ...editCoupon,
        discount: parseFloat(editCoupon.discount),
        minPurchase: editCoupon.minPurchase ? parseFloat(editCoupon.minPurchase) : null,
        maxDiscount: editCoupon.maxDiscount ? parseFloat(editCoupon.maxDiscount) : null,
        usageLimit: editCoupon.usageLimit ? parseInt(editCoupon.usageLimit) : null,
        userLimit: editCoupon.userLimit ? parseInt(editCoupon.userLimit) : null,
      });
      setShowEditModal(false);
      setEditCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error('Error editing coupon:', err);
      alert('Failed to update coupon');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const renderFormFields = (state, setState, isEdit = false) => (
    <>
      <input
        type="text"
        placeholder="Code"
        value={state.code}
        onChange={(e) => setState({ ...state, code: e.target.value.toUpperCase() })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="Description"
        value={state.description}
        onChange={(e) => setState({ ...state, description: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Discount"
        value={state.discount}
        onChange={(e) => setState({ ...state, discount: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <select
        value={state.type}
        onChange={(e) => setState({ ...state, type: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      >
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed Amount</option>
      </select>
      <input
        type="number"
        placeholder="Minimum Purchase (₹)"
        value={state.minPurchase || ''}
        onChange={(e) => setState({ ...state, minPurchase: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      {state.type === 'percentage' && (
        <input
          type="number"
          placeholder="Maximum Discount Cap (₹)"
          value={state.maxDiscount || ''}
          onChange={(e) => setState({ ...state, maxDiscount: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      )}
      <input
        type="number"
        placeholder="Global Usage Limit"
        value={state.usageLimit || ''}
        onChange={(e) => setState({ ...state, usageLimit: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <input
        type="number"
        placeholder="Per User Usage Limit"
        value={state.userLimit || ''}
        onChange={(e) => setState({ ...state, userLimit: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Coupons</h1>
            <p className="text-gray-600">Manage your discount coupons and promotional codes</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Coupons</p>
                <p className="text-2xl font-bold text-black">{coupons.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Percent size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Coupons</p>
                <p className="text-2xl font-bold text-black">{coupons.filter(c => c.isActive).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black">
                <tr>
                  <th className="py-4 px-6 text-left text-white">Code</th>
                  <th className="py-4 px-6 text-left text-white">Discount</th>
                  <th className="py-4 px-6 text-left text-white">Min Purchase</th>
                  <th className="py-4 px-6 text-left text-white">Max Cap</th>
                  <th className="py-4 px-6 text-left text-white">Limits</th>
                  <th className="py-4 px-6 text-left text-white">Status</th>
                  <th className="py-4 px-6 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon._id} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4 font-mono text-sm text-black">{coupon.code}</td>
                    <td className="px-6 py-4 text-black">
                      {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                    </td>
                    <td className="px-6 py-4 text-black">{coupon.minPurchase ? `₹${coupon.minPurchase}` : '-'}</td>
                    <td className="px-6 py-4 text-black">{coupon.maxDiscount ? `₹${coupon.maxDiscount}` : '-'}</td>
                    <td className="px-6 py-4 text-black">
                      Global: {coupon.usageLimit || '-'} <br /> Per User: {coupon.userLimit || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCouponStatus(coupon._id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          coupon.isActive ? 'bg-black text-white' : 'border border-black text-black'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditCoupon(coupon);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-black hover:bg-black hover:text-white rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          className="p-2 text-black hover:bg-black hover:text-white rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl border w-full max-w-md">
              <h2 className="text-2xl font-bold text-black mb-6">Add Coupon</h2>
              <div className="space-y-4">{renderFormFields(newCoupon, setNewCoupon)}</div>
              <div className="flex gap-4 mt-8">
                <button onClick={handleAddCoupon} className="flex-1 bg-black text-white py-3 rounded-lg font-medium">Add</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl border w-full max-w-md">
              <h2 className="text-2xl font-bold text-black mb-6">Edit Coupon</h2>
              <div className="space-y-4">{renderFormFields(editCoupon, setEditCoupon, true)}</div>
              <div className="flex gap-4 mt-8">
                <button onClick={handleEditCoupon} className="flex-1 bg-black text-white py-3 rounded-lg font-medium">Save</button>
                <button onClick={() => { setShowEditModal(false); setEditCoupon(null); }} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Coupons;
