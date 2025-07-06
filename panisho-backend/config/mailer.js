// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT, 10), // 587
  secure: false,                       // TLS on port 587
  auth: {
    user: process.env.EMAIL_USER,     // your.email@gmail.com
    pass: process.env.EMAIL_PASS      // your Gmail App password
  }
});

// Optional: verify connection configuration on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('Error configuring mailer:', err);
  } else {
    console.log('Mailer ready to send messages');
  }
});

module.exports = transporter;
