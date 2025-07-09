# Setup Email Configuration

## Konfigurasi Email untuk Ekswara Ticketing System

### 1. Setup Gmail App Password

Untuk menggunakan Gmail sebagai SMTP server, Anda perlu membuat App Password:

1. Buka Google Account Settings
2. Pilih "Security" 
3. Enable "2-Step Verification" jika belum
4. Scroll ke "App passwords"
5. Generate password untuk "Mail"
6. Copy password yang dihasilkan

### 2. Update .env File

Update file `.env` dengan konfigurasi email Anda:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-from-step-1
ADMIN_EMAIL=admin@ekswara.com
```

### 3. Endpoint yang Tersedia

#### POST /api/v1/payments/midtrans/notification
- Webhook untuk menerima notifikasi pembayaran dari Midtrans
- Otomatis mengirim email tiket setelah pembayaran berhasil

#### POST /api/v1/payments/send-ticket-email
- Manual endpoint untuk mengirim email tiket
- Berguna untuk testing atau kirim ulang email

Body:
```json
{
  "orderID": "ticket-1-1672531200000",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "destination": "Taman Jsky",
  "visitDate": "1/1/2024",
  "ticketQuantity": 2,
  "eventTime": "09:00 - 17:00",
  "totalPrice": 50000,
  "eventName": "Taman Jsky Adventure",
  "eventDescription": "Nikmati wahana seru di Taman Jsky"
}
```

#### GET /api/v1/payments/test-email
- Test koneksi email server
- Memverifikasi konfigurasi SMTP

### 4. Test Email Functionality

1. **Test koneksi email:**
   ```bash
   curl http://localhost:3000/api/v1/payments/test-email
   ```

2. **Test manual email send:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/payments/send-ticket-email \
     -H "Content-Type: application/json" \
     -d '{
       "orderID": "test-order-123",
       "customerName": "Test User",
       "customerEmail": "test@example.com",
       "destination": "Test Destination",
       "visitDate": "1/1/2024",
       "ticketQuantity": 1,
       "totalPrice": 25000
     }'
   ```

### 5. Email Template Features

Email yang dikirim akan berisi:
- Order ID sebagai kode tiket
- Detail pemesanan lengkap
- Informasi event dan destinasi
- Status pembayaran
- Instruksi penggunaan tiket
- Format HTML yang responsive

### 6. Integrasi dengan Frontend

Frontend secara otomatis akan:
1. Memanggil Midtrans untuk pembayaran
2. Setelah pembayaran berhasil, kirim request ke `/send-ticket-email`
3. Menampilkan konfirmasi bahwa email tiket telah dikirim
4. Redirect ke halaman event

### 7. Error Handling

- Jika email gagal dikirim, tidak akan mengganggu flow pembayaran
- Error di-log untuk monitoring
- User tetap menerima konfirmasi pembayaran berhasil
- Admin dapat mengirim ulang email manual jika diperlukan

### 8. Security

- Webhook notification dari Midtrans diverifikasi dengan signature
- Email credentials di-encrypt di environment variables
- Order data disimpan sementara dan dihapus setelah email terkirim

### 9. Monitoring

Log yang tersedia:
- Email connection status
- Email send status
- Order data storage/retrieval
- Payment notification processing

### 10. Alternative Email Providers

Jika tidak menggunakan Gmail, update konfigurasi SMTP di `services/email.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: "your-smtp-server.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

Common SMTP settings:
- **Gmail:** smtp.gmail.com:587
- **Outlook:** smtp-mail.outlook.com:587
- **Yahoo:** smtp.mail.yahoo.com:587
- **SendGrid:** smtp.sendgrid.net:587
