import React, { useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function VerifyEmailPage() {
  const [form, setForm] = useState({ email:'', otp:'' });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/auth/verify-email', form);
      toast.success('Email verified! You are now logged in.');
      navigate('/'); // or wherever
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Verify Your Email</h2>
        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-pink-300 focus:ring-pink-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-700">OTP Code</span>
          <input
            type="text"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            required
            maxLength={6}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-pink-300 focus:ring-pink-200 focus:ring-opacity-50"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-md font-medium transition-colors"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
