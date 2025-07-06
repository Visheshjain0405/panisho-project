import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/wishlist', { withCredentials: true })
      .then(({ data }) => {
        setWishlist(data.map((p) => p._id));
      })
      .catch((err) => {
        console.error('Failed to load wishlist', err);
        setWishlist([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Toggle wishlist with optimistic updates
  const toggleWishlist = async (productId) => {
    if (!user) {
      return navigate('/auth');
    }

    const inList = wishlist.includes(productId);
    // Optimistically update the wishlist
    setWishlist((prev) =>
      inList ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    try {
      if (inList) {
        await api.delete(`/wishlist/${productId}`, { withCredentials: true });
      } else {
        await api.post('/wishlist', { productId }, { withCredentials: true });
      }
    } catch (err) {
      // Roll back optimistic update on failure
      setWishlist((prev) =>
        inList ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      console.error('Wishlist toggle failed', err);
      // Optionally trigger a toast notification here
      throw err; // Allow caller to handle error (e.g., show toast)
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}