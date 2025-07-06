const Address = require('../models/Address');

exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id });
  res.json(addresses);
};

exports.saveAddress = async (req, res) => {
  const { type, name, street, city, state, pincode, phone } = req.body;
  const userId = req.user._id;

  const address = new Address({ userId, type, name, street, city, state, pincode, phone });
  await address.save();

  res.status(201).json(address);
};

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const userId = req.user._id;

  try {
    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      updatedData,
      { new: true }
    );

    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

