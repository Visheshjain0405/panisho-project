const NewsletterSubscriber = require('../models/newsletterSubscriber');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Already subscribed' });
    }

    const subscriber = new NewsletterSubscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const list = await NewsletterSubscriber.find().sort('-createdAt');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
};
