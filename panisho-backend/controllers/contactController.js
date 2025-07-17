const Contact = require('../models/Contact');
const transporter = require('../config/mailer');


// exports.submitContactForm = async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;
//     const contact = new Contact({
//       name,
//       email,
//       subject,
//       message,
//       createdAt: new Date(),
//     });
//     await contact.save();
//     res.status(201).json({ message: 'Contact form submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log(req.body)
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });
    await contact.save();

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Contact Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #F7CAC9; padding: 20px; color: #333;">
          <h2 style="color: #FFFFFF;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};