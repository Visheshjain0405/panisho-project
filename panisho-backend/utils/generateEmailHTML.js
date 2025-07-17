const fs = require('fs');
const path = require('path');

exports.generateEmailHTML = ({ order, user, address }) => {
  const itemRows = order.items.map(item => {
    const product = item.product || {};
    const variant = item.variant || {};
    const productImage = product.images?.[0] || '';
    const price = item.variant?.sellingPrice || item.product?.sellingPrice || 0;


    return `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="100" style="padding-right: 20px; vertical-align: top;">
              ${productImage
        ? `<img src="${productImage}" alt="${product.name || 'Product'}" style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover; border: 3px solid #fce4ec; box-shadow: 0 2px 8px rgba(233, 30, 99, 0.1);" />`
        : `<div style="width: 90px; height: 90px; background: #fce4ec; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; border: 3px solid #e91e63; box-shadow: 0 2px 8px rgba(233, 30, 99, 0.1);">🛍️</div>`}
            </td>
            <td style="vertical-align: top;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-weight: 700; font-size: 16px; color: #333; line-height: 1.4; margin-bottom: 8px;">${product.name || 'Unknown Product'}</div>
                    ${variant.volume ? `<div style="font-size: 13px; color: #999;">Variant: ${variant.volume} ${variant.volumeUnit || ''}</div>` : ''}
                  </td>
                  <td style="text-align: right; vertical-align: top; width: 100px; padding-left: 15px;">
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Quantity</div>
                      <div style="font-weight: 700; font-size: 16px; color: #e91e63;">${item.quantity}</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Price</div>
                      <div style="font-weight: 700; font-size: 18px; color: #333;">₹${price}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
  }).join('');


  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Order Confirmation - PANISHO</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        /* Base styles */
        body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; height: 100% !important; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
        table { border-collapse: collapse !important; }
        img { height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; max-width: 100% !important; }
          .mobile-padding { padding: 20px 15px !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-full-width { width: 100% !important; display: block !important; }
          .mobile-stack { display: block !important; width: 100% !important; }
          .mobile-hide { display: none !important; }
          .order-number { font-size: 16px !important; }
          .total-amount { font-size: 18px !important; }
          .button { padding: 12px 20px !important; font-size: 14px !important; }
          .logo { width: 100px !important; }
          .success-check { width: 70px !important; height: 70px !important; }
          .success-check span { font-size: 32px !important; line-height: 70px !important; }
          .product-image { width: 70px !important; height: 70px !important; }
          .product-info { width: 100px !important; }
        }
        
        @media only screen and (max-width: 480px) {
          .mobile-padding { padding: 15px 10px !important; }
          .header-title { font-size: 24px !important; }
          .section-title { font-size: 16px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
      <!-- Wrapper Table -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 10px;">
            
            <!-- Main Container -->
            <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%); padding: 40px 30px; text-align: center;">
                  <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png" alt="PANISHO Logo" class="logo" style="width: 120px; height: auto; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" />
                  <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500;">Premium Beauty & Hair Care</p>
                </td>
              </tr>
              
              <!-- Success Message -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(180deg, #fff0f7 0%, #ffffff 100%);">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                          <tr>
                            <td>
                              <div class="success-check" style="width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: table-cell; vertical-align: middle; text-align: center; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.2); margin: 0 auto 20px auto;">
                                <span style="font-size: 36px; color: #16a34a; line-height: 80px; display: inline-block; vertical-align: middle;">✓</span>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <h2 style="margin: 20px 0 10px 0; color: #e91e63; font-size: 24px; font-weight: 600;">Order Confirmed!</h2>
                  <p style="margin: 0 0 25px 0; color: #666; font-size: 16px; line-height: 1.5;">Thank you for choosing PANISHO. Your beauty journey continues!</p>
                  
                  <!-- Order Number Badge -->
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #fce4ec; border: 2px solid #e91e63; border-radius: 8px; padding: 15px 25px; text-align: center;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</div>
                        <div class="order-number" style="font-size: 18px; font-weight: 700; color: #e91e63;">#${order._id}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Order Details -->
              <tr>
                <td class="mobile-padding" style="padding: 30px;">
                  
                  <!-- Order Summary -->
                  <h3 class="section-title" style="margin: 0 0 20px 0; color: #e91e63; font-size: 18px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f8bbd9;">📋 Order Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #666;">Date:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 600; text-align: right;">${date}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #666;">Payment Method:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 600; text-align: right; text-transform: uppercase;">${order.paymentMethod}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #666;">Customer:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 600; text-align: right;">${user.firstName} ${user.lastName}</td>
                    </tr>
                  </table>
                  
                  <!-- Order Items -->
                  <h3 class="section-title" style="margin: 0 0 20px 0; color: #e91e63; font-size: 18px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f8bbd9;">🛍️ Your Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    ${itemRows}
                  </table>
                  
                  <!-- Pricing Details -->
                  <h3 class="section-title" style="margin: 0 0 20px 0; color: #e91e63; font-size: 18px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f8bbd9;">💰 Pricing Details</h3>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
  <tr>
    <td style="padding: 8px 0; font-size: 14px; color: #666;">Subtotal:</td>
    <td style="padding: 8px 0; font-size: 14px; color: #333; font-weight: 600; text-align: right;">₹${order.subtotal}</td>
  </tr>
  <tr>
    <td style="padding: 8px 0; font-size: 14px; color: #666;">Shipping:</td>
    <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">
      ${order.shipping === 0 ? '<span style="color: #16a34a;">FREE</span>' : `₹${order.shipping}`}
    </td>
  </tr>

  ${order.discount && order.discount > 0
      ? `<tr>
        <td style="padding: 8px 0; font-size: 14px; color: #666;">Discount:</td>
        <td style="padding: 8px 0; font-size: 14px; color: #16a34a; font-weight: 600; text-align: right;">- ₹${order.discount}</td>
      </tr>`
      : ''}

  <tr style="border-top: 2px solid #f0f0f0;">
    <td style="padding: 15px 0 8px 0; font-size: 16px; color: #333; font-weight: 700;">Total:</td>
    <td class="total-amount" style="padding: 15px 0 8px 0; font-size: 20px; color: #e91e63; font-weight: 700; text-align: right;">₹${order.total}</td>
  </tr>
</table>

                  
                  <!-- Shipping Information -->
                  <h3 class="section-title" style="margin: 0 0 20px 0; color: #e91e63; font-size: 18px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #f8bbd9;">🚚 Shipping Information</h3>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #e91e63;">
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #333; font-size: 14px;">${address.name}</p>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">${address.street}, ${address.city}, ${address.state} - ${address.pincode}</p>
                    <p style="margin: 0; color: #666; font-size: 14px;">📞 ${address.phone}</p>
                  </div>
                </td>
              </tr>
              
              
              
              <!-- Footer -->
              <tr>
                <td style="background: #2c2c2c; padding: 30px; text-align: center;">
                  <h4 style="margin: 0 0 10px 0; color: #e91e63; font-size: 18px; font-weight: 600; letter-spacing: 1px;">PANISHO</h4>
                  <p style="margin: 0; font-size: 12px; color: #999;">© 2025 Panisho. All rights reserved.</p>
                  <p style="margin: 10px 0 0 0; font-size: 11px; color: #666;">This email was sent to confirm your order. Please keep this for your records.</p>
                </td>
              </tr>
              
            </table>
            <!-- End Main Container -->
            
          </td>
        </tr>
      </table>
      <!-- End Wrapper Table -->
    </body>
    </html>
  `;
};