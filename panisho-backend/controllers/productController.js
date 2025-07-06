const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const slugify = require('slugify');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      keywords,
      ingredients,
      skinHairType,
      targetAudience,
      usageInstructions,
      displayOptions,
      productTypes
    } = req.body;

    if (!req.body.variants) {
      return res.status(400).json({ message: 'Variants are required.' });
    }

    let parsedVariants = [];
    try {
      parsedVariants = JSON.parse(req.body.variants);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants JSON', error: e.message });
    }

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required.' });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products', resource_type: 'image' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        })
      );
      imageUrls = await Promise.all(uploads);
    }

    const cleanName = (name || '').split(' ')[0].toUpperCase();

    const newProduct = new Product({
      name,
      description,
      category,
      images: imageUrls,
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map(k => k.trim()),
      ingredients,
      skinHairType,
      targetAudience,
      usageInstructions,
      displayOptions: Array.isArray(displayOptions) ? displayOptions : [],
      productTypes: Array.isArray(productTypes) ? productTypes : [],
      variants: parsedVariants.map((v, i) => {
        if (parseInt(v.stock) < 1) {
          throw new Error(`Stock must be at least 1 for variant ${i + 1}`);
        }

        const volume = `${v.volume}${v.volumeUnit}`;
        const sku = v.sku && v.sku.trim()
          ? v.sku.trim()
          : `${cleanName}-${volume}-${i + 1}`;

        return {
          volume: v.volume,
          volumeUnit: v.volumeUnit,
          mrp: parseFloat(v.mrp),
          sellingPrice: parseFloat(v.sellingPrice),
          stock: parseInt(v.stock),
          sku
        };
      })
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Product creation error:', err);
    res.status(400).json({ message: err.message });
  }
};


// Get all products (optional filter by categorySlug)
exports.getAllProducts = async (req, res) => {
  try {
    const { categorySlug } = req.query;
    let filter = {};

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      } else {
        return res.status(200).json([]); // no matching category
      }
    }

    const products = await Product.find(filter).populate('category', 'title slug');
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'title slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      keywords,
      ingredients,
      skinHairType,
      targetAudience,
      usageInstructions,
      displayOptions,
      productTypes
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!req.body.variants) {
      return res.status(400).json({ message: 'Variants are required.' });
    }

    let parsedVariants = [];
    try {
      parsedVariants = JSON.parse(req.body.variants);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants JSON', error: e.message });
    }

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required.' });
    }

    // Update basic fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.ingredients = ingredients || product.ingredients;
    product.skinHairType = skinHairType || product.skinHairType;
    product.targetAudience = targetAudience || product.targetAudience;
    product.usageInstructions = usageInstructions || product.usageInstructions;
    product.keywords = Array.isArray(keywords)
      ? keywords
      : (keywords || '').split(',').map(k => k.trim());
    product.displayOptions = Array.isArray(displayOptions) ? displayOptions : [];
    product.productTypes = Array.isArray(productTypes) ? productTypes : [];

    const cleanName = (name || product.name || '').split(' ')[0].toUpperCase();

    product.variants = parsedVariants.map((v, i) => {
      if (parseInt(v.stock) < 1) {
        throw new Error(`Stock must be at least 1 for variant ${i + 1}`);
      }

      const volume = `${v.volume}${v.volumeUnit}`;
      const sku = v.sku && v.sku.trim()
        ? v.sku.trim()
        : `${cleanName}-${volume}-${i + 1}`;

      return {
        volume: v.volume,
        volumeUnit: v.volumeUnit,
        mrp: parseFloat(v.mrp),
        sellingPrice: parseFloat(v.sellingPrice),
        stock: parseInt(v.stock),
        sku
      };
    });

    // Replace images if new uploaded
    if (req.files && req.files.length > 0) {
      const deletePromises = (product.images || []).map(url => {
        const file = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`products/${file}`);
      });
      await Promise.all(deletePromises);

      const uploads = req.files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'products', resource_type: 'image' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        })
      );
      product.images = await Promise.all(uploads);
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
};



// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(url => {
        const file = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`products/${file}`);
      });
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

// Get products by category slug
// GET /products/category/:slug
exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find products with matching category
    const products = await Product.find({ category: category._id });

    // Map variant fields to top-level for frontend use
    const formatted = products.map(p => {
      const first = p.variants[0] || {};
      return {
        _id: p._id,
        name: p.name,
        description: p.description,
        images: p.images,
        rating: p.rating || 4.2,
        stock: first.stock,
        sellingPrice: first.sellingPrice,
        mrp: first.mrp,
        volume: first.volume,
        volumeUnit: first.volumeUnit,
        sku: first.sku,
        variants: p.variants,
        createdAt: p.createdAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching products by category:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
