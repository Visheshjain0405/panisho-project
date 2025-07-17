const NavbarCategory = require('../models/NavbarCategory');
const Category = require('../models/Category');

exports.createNavbarCategory = async (req, res) => {
  try {
    const { navbarCategory, category } = req.body;

    if (!navbarCategory || !category) {
      return res.status(400).json({ message: 'Both navbar category and category are required' });
    }

    // Verify category exists
    const categoryExists = await Category.findOne({ title: category });
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Verify navbarCategory is valid
    const validNavbarCategories = ['Beauty Products', 'Hair Products'];
    if (!validNavbarCategories.includes(navbarCategory)) {
      return res.status(400).json({ message: 'Invalid navbar category' });
    }

    const navbarCategoryDoc = new NavbarCategory({
      navbarCategory,
      category: categoryExists._id,
    });

    await navbarCategoryDoc.save();
    res.status(201).json(navbarCategoryDoc);
  } catch (error) {
    console.error('Error creating navbar category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNavbarCategories = async (req, res) => {
  try {
    const navbarCategories = await NavbarCategory.find()
      .populate('category', 'title slug');
    res.status(200).json(navbarCategories);
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};