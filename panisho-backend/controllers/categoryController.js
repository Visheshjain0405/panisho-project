const Category  = require('../models/Category');
const cloudinary = require('cloudinary').v2;

/**
 * Helper to upload a single buffer to Cloudinary and return secure_url
 */
function uploadCategoryImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'categories', resource_type: 'image' },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
    stream.end(buffer);
  });
}

exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadCategoryImage(req.file.buffer);
    }

    const newCategory = new Category({ title, image: imageUrl });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("createCategory:", error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort('title');
    res.json(cats);
  } catch (error) {
    console.error("getAllCategories:", error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (error) {
    console.error("getCategoryById:", error);
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    // update title
    if (title) cat.title = title;

    // handle image replacement
    if (req.file) {
      // delete old
      if (cat.image) {
        const publicId = cat.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`categories/${publicId}`);
      }
      // upload new
      cat.image = await uploadCategoryImage(req.file.buffer);
    }

    const updated = await cat.save();
    res.json(updated);
  } catch (error) {
    console.error("updateCategory:", error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    if (cat.image) {
      const publicId = cat.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

await cat.deleteOne();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error("deleteCategory:", error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
