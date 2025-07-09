const express = require("express");
const {
  createInvoice,
  simulatePayment,
  createMidtransTransaction,
  handlePaymentNotification,
  sendTicketEmailManual,
  testEmailConnection,
  getOrderStatus,
  checkTransactionStatus,
  checkAndUpdateTransactionStatus,
  checkAllPendingTransactions,
} = require("../../controllers/payments");

const router = express.Router();

// Endpoint untuk membuat invoice baru (Xendit)
router.post("/payments/invoices", createInvoice);

// Endpoint untuk mensimulasikan pembayaran pada payment request (Xendit)
router.post("/payments/invoices/:paymentRequestId/simulate", simulatePayment);

// Endpoint untuk membuat transaksi Midtrans
router.post("/payments/midtrans/transaction", createMidtransTransaction);

// Endpoint untuk menerima notifikasi pembayaran dari Midtrans (webhook)
router.post("/payments/midtrans/notification", handlePaymentNotification);

// Endpoint untuk mengirim email tiket secara manual
router.post("/payments/send-ticket-email", sendTicketEmailManual);

// Endpoint untuk test koneksi email
router.get("/payments/test-email", testEmailConnection);

// Endpoint untuk mendapatkan status order
router.get("/payments/orders/:orderId/status", getOrderStatus);

// Endpoint untuk check status transaksi dari Midtrans
router.post("/payments/midtrans/:orderId/check-status", checkTransactionStatus);

// Endpoint untuk check dan update status transaksi dari Midtrans
router.post(
  "/payments/orders/:orderId/check-and-update",
  checkAndUpdateTransactionStatus
);

// Endpoint untuk check semua transaksi pending
router.post("/payments/check-all-pending", checkAllPendingTransactions);

module.exports = router;
