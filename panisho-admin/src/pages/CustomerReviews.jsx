import React, { useState, useEffect } from 'react';
import { Search, Star, MessageSquare, User, Calendar, Filter, Send, X } from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';

function CustomerReviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalReviewId, setModalReviewId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('reviews/admin/reviews');
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating?.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;
  const fourStarReviews = reviews.filter(r => r.rating === 4).length;

  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  );

  const openReplyModal = (reviewId) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review?.adminReply?.message) return; // Prevent opening if reply exists
    setModalReviewId(reviewId);
    setReplyText('');
  };

  const closeReplyModal = () => {
    setModalReviewId(null);
    setReplyText('');
    setIsSubmitting(false);
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/reviews/${reviewId}/admin-reply`, { message: replyText });
      setReviews(reviews.map(review =>
        review.id === reviewId
          ? { ...review, adminReply: { message: replyText, date: new Date() } }
          : review
      ));
      closeReplyModal();
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Product Reviews</h1>
            <p className="text-gray-600">Manage customer reviews and ratings for your products</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{
            label: 'Total Reviews',
            value: totalReviews,
            icon: MessageSquare,
            bg: 'bg-blue-100',
            iconColor: 'text-blue-600'
          }, {
            label: 'Average Rating',
            value: averageRating.toFixed(1),
            icon: Star,
            bg: 'bg-purple-100',
            iconColor: 'text-purple-600'
          }, {
            label: '5 Star Reviews',
            value: fiveStarReviews,
            icon: Star,
            bg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          }, {
            label: '4+ Star Reviews',
            value: fiveStarReviews + fourStarReviews,
            icon: Star,
            bg: 'bg-green-100',
            iconColor: 'text-green-600'
          }].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon size={24} className={stat.iconColor} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Review Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Customer</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Rating</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Review</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Admin Reply</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.customerName}</p>
                          <p className="text-sm text-gray-500">{review.customerEmail}</p>
                          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1">
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{review.productName}</p>
                      <p className="text-sm text-gray-500">ID: {review.productId}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-medium text-gray-900 mb-1">{review.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      {review.adminReply?.message ? (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 font-medium">Admin Response:</p>
                          <p className="text-sm text-gray-800">{review.adminReply.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.adminReply.date).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openReplyModal(review.id)}
                            disabled={review.adminReply?.message}
                            className={`p-2 rounded-lg flex items-center justify-center ${
                              review.adminReply?.message
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                            }`}
                            title={review.adminReply?.message ? 'Reply already submitted' : 'Reply to review'}
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews found</p>
              <p className="text-gray-400">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Reply Modal */}
        {modalReviewId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Reply to Review</h2>
                <button onClick={closeReplyModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {reviews.find(r => r.id === modalReviewId)?.adminReply?.message && (
                <p className="text-red-500 text-sm mb-2">This review already has a reply from admin.</p>
              )}

              <textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeReplyModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReplySubmit(modalReviewId)}
                  disabled={
                    isSubmitting ||
                    !replyText.trim() ||
                    reviews.find(r => r.id === modalReviewId)?.adminReply?.message
                  }
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
                    isSubmitting ||
                    !replyText.trim() ||
                    reviews.find(r => r.id === modalReviewId)?.adminReply?.message
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send size={16} />
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerReviews;
