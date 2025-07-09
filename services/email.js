require("dotenv").config();
const nodemailer = require("nodemailer");

// Konfigurasi transporter untuk email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Ganti sesuai provider email Anda
    port: 587,
    secure: false, // true untuk 465, false untuk port lain
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "your-app-password", // Gunakan app password untuk Gmail
    },
  });
};

/**
 * Generate HTML template untuk email tiket
 * @param {object} ticketData - Data tiket yang akan dikirim
 * @returns {string} - HTML template
 */
const generateTicketEmailTemplate = (ticketData) => {
  const {
    orderID,
    customerName,
    customerEmail,
    destination,
    visitDate,
    ticketQuantity,
    eventTime,
    totalPrice,
    paymentStatus,
    eventName,
    eventDescription,
  } = ticketData;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tiket Ekswara - ${orderID}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px -20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .ticket-info {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
            .info-label {
                font-weight: bold;
                color: #555;
            }
            .info-value {
                color: #333;
            }
            .status-paid {
                background-color: #4CAF50;
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-weight: bold;
            }
            .qr-code {
                text-align: center;
                margin: 20px 0;
                padding: 20px;
                background-color: #f0f0f0;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .important-note {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎫 E-Tiket Ekswara</h1>
                <p>Terima kasih atas pembelian tiket Anda!</p>
            </div>
            
            <div class="ticket-info">
                <h2 style="margin-top: 0; color: #4CAF50;">Detail Pemesanan</h2>
                
                <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value"><strong>${orderID}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Nama Pemesan:</span>
                    <span class="info-value">${customerName}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${customerEmail}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Destinasi:</span>
                    <span class="info-value"><strong>${destination}</strong></span>
                </div>
                
                ${
                  eventName
                    ? `
                <div class="info-row">
                    <span class="info-label">Event:</span>
                    <span class="info-value"><strong>${eventName}</strong></span>
                </div>
                `
                    : ""
                }
                
                <div class="info-row">
                    <span class="info-label">Tanggal Kunjungan:</span>
                    <span class="info-value">${visitDate}</span>
                </div>
                
                ${
                  eventTime
                    ? `
                <div class="info-row">
                    <span class="info-label">Waktu Event:</span>
                    <span class="info-value">${eventTime}</span>
                </div>
                `
                    : ""
                }
                
                <div class="info-row">
                    <span class="info-label">Jumlah Tiket:</span>
                    <span class="info-value">${ticketQuantity} tiket</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Total Harga:</span>
                    <span class="info-value"><strong>Rp ${totalPrice.toLocaleString(
                      "id-ID"
                    )}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Status Pembayaran:</span>
                    <span class="info-value">
                        <span class="status-paid">${paymentStatus.toUpperCase()}</span>
                    </span>
                </div>
            </div>
            
            <div class="qr-code">
                <h3>Kode Tiket</h3>
                <div style="font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; background-color: white; padding: 10px; border: 2px dashed #4CAF50; display: inline-block;">
                    ${orderID}
                </div>
                <p><em>Tunjukkan kode ini saat memasuki lokasi</em></p>
            </div>
            
            ${
              eventDescription
                ? `
            <div class="important-note">
                <h4>Informasi Event:</h4>
                <p>${eventDescription}</p>
            </div>
            `
                : ""
            }
            
            <div class="important-note">
                <h4>⚠️ Penting:</h4>
                <ul>
                    <li>Simpan email ini sebagai bukti pembelian tiket</li>
                    <li>Tunjukkan Order ID saat memasuki lokasi</li>
                    <li>Tiket berlaku sesuai tanggal yang tertera</li>
                    <li>Tidak dapat dikembalikan atau dipindahtangankan</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Terima kasih telah memilih <strong>Ekswara</strong>!</p>
                <p>Jika ada pertanyaan, hubungi customer service kami.</p>
                <p style="font-size: 12px; color: #999;">
                    Email ini dikirim otomatis. Mohon tidak membalas email ini.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Kirim email tiket setelah pembayaran berhasil
 * @param {object} ticketData - Data tiket yang akan dikirim
 * @returns {Promise<object>} - Result pengiriman email
 */
const sendTicketEmail = async (ticketData) => {
  try {
    const {
      orderID,
      customerName,
      customerEmail,
      destination,
      visitDate,
      ticketQuantity,
      totalPrice,
    } = ticketData;

    // Validasi data required
    if (!orderID || !customerName || !customerEmail || !destination) {
      throw new Error("Missing required ticket data for email");
    }

    const transporter = createTransporter();

    // Generate HTML content
    const htmlContent = generateTicketEmailTemplate(ticketData);

    // Setup email options
    const mailOptions = {
      from: {
        name: "Ekswara Ticketing",
        address: process.env.EMAIL_USER || "noreply@ekswara.com",
      },
      to: customerEmail,
      cc: process.env.ADMIN_EMAIL || "", // Optional: CC ke admin
      subject: `🎫 E-Tiket Ekswara - Order ${orderID}`,
      html: htmlContent,
      text: `
        E-Tiket Ekswara
        
        Order ID: ${orderID}
        Nama: ${customerName}
        Email: ${customerEmail}
        Destinasi: ${destination}
        Tanggal Kunjungan: ${visitDate}
        Jumlah Tiket: ${ticketQuantity}
        Total Harga: Rp ${totalPrice.toLocaleString("id-ID")}
        Status: PAID
        
        Simpan email ini sebagai bukti pembelian tiket.
        Tunjukkan Order ID saat memasuki lokasi.
        
        Terima kasih telah memilih Ekswara!
      `,
    };

    // Kirim email
    console.log(`Sending ticket email to: ${customerEmail}`);
    const result = await transporter.sendMail(mailOptions);

    console.log("Ticket email sent successfully:", {
      messageId: result.messageId,
      orderID: orderID,
      recipient: customerEmail,
    });

    return {
      success: true,
      messageId: result.messageId,
      orderID: orderID,
      recipient: customerEmail,
    };
  } catch (error) {
    console.error("Error sending ticket email:", error);
    throw new Error(`Email Error: ${error.message}`);
  }
};

/**
 * Test koneksi email
 * @returns {Promise<boolean>} - Status koneksi
 */
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email connection test successful");
    return true;
  } catch (error) {
    console.error("Email connection test failed:", error);
    return false;
  }
};

module.exports = {
  sendTicketEmail,
  testEmailConnection,
  generateTicketEmailTemplate,
};
