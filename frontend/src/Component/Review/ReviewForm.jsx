import React, { useState } from 'react';
import { Star } from 'lucide-react';
import api from '../../api/axiosInstance';

const ReviewForm = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !name.trim() || !comment.trim()) {
      setError('Please fill out all fields');
      return;
    }

    setSubmitting(true);
    try {
      const newReview = {
        name: name.trim(),
        rating,
        comment: comment.trim()
      };

      const response = await api.post(`reviews/${productId}/reviews`, newReview); // <-- Make actual API call here
      onSubmit(response.data); // Pass saved review back to parent
      setRating(0);
      setName('');
      setComment('');
      setError('');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          rows="4"
          placeholder="Write your review here"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;