const cloudinary = require('cloudinary').v2;
const Slider = require('../models/Slider');
const { uploadImageToCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all slider images
// @route   GET /api/slider
// @access  Public
exports.getAllSlides = async (req, res, next) => {
  try {
    const slides = await Slider.find().sort({ order: 1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
    next(error);
  }
};

// @desc    Create a new slider image
// @route   POST /api/slider
// @access  Public
exports.createSlide = async (req, res, next) => {
  try {
    const { title, description, clickUrl } = req.body;
    const imageFile = req.file;

    if (!title || !imageFile) {
      return res.status(400).json({ message: 'Title and image are required' });
    }

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(imageFile.mimetype)) {
      return res.status(400).json({ message: 'Only JPG/PNG images are allowed' });
    }

    // Upload image to Cloudinary
    const filename = `${Date.now()}_${title.replace(/\s+/g, '_')}`;
    const imageUrl = await uploadImageToCloudinary(imageFile.buffer, filename);

    // Calculate order for new slide
    const lastSlide = await Slider.findOne().sort({ order: -1 });
    const newOrder = lastSlide ? lastSlide.order + 1 : 1;

    const slide = await Slider.create({
      title,
      description,
      clickUrl,
      imageUrl,
      order: newOrder,
    });

    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
    next(error);
  }
};

// @desc    Update a slider image
// @route   PUT /api/slider/:id
// @access  Public
exports.updateSlide = async (req, res, next) => {
  try {
    const { title, description, clickUrl } = req.body;
    const imageFile = req.file;
    const slide = await Slider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let imageUrl = slide.imageUrl;
    if (imageFile) {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(imageFile.mimetype)) {
        return res.status(400).json({ message: 'Only JPG/PNG images are allowed' });
      }

      const filename = `${Date.now()}_${title.replace(/\s+/g, '_')}`;
      imageUrl = await uploadImageToCloudinary(imageFile.buffer, filename);
    }

    slide.title = title;
    slide.description = description || slide.description;
    slide.clickUrl = clickUrl || slide.clickUrl;
    slide.imageUrl = imageUrl;

    await slide.save();
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
    next(error);
  }
};

// @desc    Toggle slide status
// @route   PUT /api/slider/:id/status
// @access  Public
exports.toggleSlideStatus = async (req, res, next) => {
  try {
    const slide = await Slider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    slide.isActive = req.body.isActive;
    await slide.save();
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
    next(error);
  }
};

// @desc    Delete a slider image
// @route   DELETE /api/slider/:id
// @access  Public
exports.deleteSlide = async (req, res, next) => {
  try {
    const slide = await Slider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Delete image from Cloudinary
    const publicId = slide.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`slider_images/${publicId}`);

    await slide.remove();
    res.status(200).json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
    next(error);
  }
};