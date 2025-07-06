const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

exports.generateInvoicePDFBuffer = async ({ user, address, items, ...order }) => {
  try {
    const templatePath = path.join(__dirname, 'invoiceTemplate.ejs');
    const html = await ejs.renderFile(templatePath, {
      user,
      address,
      items,
      order,
      logoUrl: 'https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png'
    });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Invoice generation error:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};
