const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Helper: enrich cart item with price + total
const enrichCart = (items) => {
  return items.map(item => {
    const product = item.productId;
    const variant = item.variant;
    const quantity = item.quantity ?? 1;
    const price = variant?.sellingPrice || 0;

    return {
      _id: item._id,
      productId: product,
      variant,
      quantity,
      amount: price * quantity,
    };
  });
};


// ✅ GET all cart items for the current user
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId');
    const enriched = enrichCart(cartItems);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart items', error });
  }
};

// ✅ POST: Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;
    console.log("🛒 Add to cart request:", { productId, quantity, variant });
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });


    const existing = await CartItem.findOne({ userId, productId, 'variant.sku': variant.sku });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await CartItem.create({
        userId,
        productId,
        quantity,
        variant
      });
    }

    const cartItems = await CartItem.find({ userId }).populate('productId');
    res.status(201).json(cartItems);

  } catch (error) {
    console.error("🔥 Add to cart failed:", error);
    res.status(500).json({ message: 'Failed to add to cart', error });
  }
};



// ✅ PUT: Update quantity of a cart item
exports.updateCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findOne({ _id: itemId, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();

    const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId');
    const enriched = enrichCart(cartItems);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item', error });
  }
};

// ✅ DELETE: Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await CartItem.deleteOne({ _id: itemId, userId: req.user._id });

    const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId');
    const enriched = enrichCart(cartItems);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item', error });
  }
};
