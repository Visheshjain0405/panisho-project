// src/context/CartContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart', { withCredentials: true });
      setCart(res.data);
      console.log('Cart fetched:', res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async ({ productId, variant, quantity = 1 }) => {
    try {
      const payload = { productId, variant, quantity };
      console.log("🛒 Sending cart payload:", payload); // ✅ Debug line
      const res = await api.post('/cart', payload, { withCredentials: true });
      setCart(res.data);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const updateCart = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity }, { withCredentials: true });
      setCart(res.data);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`, { withCredentials: true });
      setCart(res.data);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

    // ✅ New clearCart method
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
