const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};