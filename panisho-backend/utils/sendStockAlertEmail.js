const transporter = require('../config/mailer');

const sendStockAlertEmail = async (productName, variant, stockLeft) => {
  const subject = `🔔 Low Stock Alert: ${productName} (${variant.volume}${variant.volumeUnit})`;
  const html = `
    <h3>Low Stock Alert</h3>
    <p><strong>Product:</strong> ${productName}</p>
    <p><strong>Variant:</strong> ${variant.volume}${variant.volumeUnit}</p>
    <p><strong>SKU:</strong> ${variant.sku}</p>
    <p><strong>Remaining Stock:</strong> ${stockLeft}</p>
    <p>Kindly restock to avoid going out of stock.</p>
  `;

  await transporter.sendMail({
    from: `"Panisho" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, // set in .env
    subject,
    html
  });
};

module.exports = { sendStockAlertEmail };
