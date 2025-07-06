const Review = require("../models/Review");
const cloudinary = require("cloudinary").v2;

// ✅ Inline Cloudinary Config (specific for review uploads)
cloudinary.config({
  cloud_name: "djh2ro9tm",
  api_key: "282886467276386",
  api_secret: "5XHxDAv7Xpqvl4IoZRYkEcbikoc"
});

// ✅ Upload helper from memory
const uploadToCloudinary = async (file) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: "review"
  });
  return result.secure_url;
};

// ✅ Add Review Controller
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, userId } = req.body;
    console.log("Received review data:", req.body);

    if (!productId || !rating || !title || !comment || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    let uploadedImages = [];

    // ✅ Upload all images to Cloudinary
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(file => uploadToCloudinary(file))
      );
    }

    const newReview = new Review({
      productId,
      userId,
      rating,
      title,
      comment,
      images: uploadedImages
    });

    await newReview.save();

    res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (error) {
    console.error("❌ Error adding review:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

// ✅ Get Reviews by Product ID
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Admin: Get All Reviews (optionally with filters)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'firstName lastName email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    const formatted = reviews.map((r) => ({
      id: r._id,
      customerName: `${r.userId?.firstName || 'User'} ${r.userId?.lastName || ''}`,
      customerEmail: r.userId?.email || '',
      productName: r.productId?.name || '',
      productId: r.productId?._id || '',
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: r.createdAt,
      adminReply: r.adminReply || null,
      verified: true
    }));


    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching all reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Get Random Public Reviews
exports.getRandomPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'firstName lastName avatar')
      .populate('productId', 'name')
      .limit(50) // Limit to avoid performance issues
      .sort({ createdAt: -1 });

    // Shuffle and select up to 6 reviews
    const randomReviews = reviews.sort(() => Math.random() - 0.5).slice(0, 6);

    const formatted = randomReviews.map((r) => ({
      id: r._id,
      customerName: `${r.userId?.firstName || 'User'} ${r.userId?.lastName || ''}`,
      avatar: r.userId?.avatar || '',
      productName: r.productId?.name || 'Unknown Product',
      productId: r.productId?._id || '',
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: r.createdAt,
      images: r.images || [],
      adminReply: r.adminReply || null,
      verified: true
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching random reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Controller: Get Review Stats (Average Rating + Total Reviews)
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({ avgRating: 0, totalReviews: 0 });
    }

    const { avgRating, totalReviews } = stats[0];
    res.status(200).json({ avgRating, totalReviews });
  } catch (error) {
    console.error("❌ Error fetching review stats:", error);
    res.status(500).json({ error: "Failed to fetch review statistics." });
  }
};

// PATCH /reviews/:id/admin-reply
exports.addAdminReply = async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { adminReply: { message, date: new Date() } },
      { new: true }
    );

    res.status(200).json({ success: true, review });
  } catch (err) {
    console.error("❌ Error replying to review:", err);
    res.status(500).json({ error: "Failed to reply" });
  }
};

