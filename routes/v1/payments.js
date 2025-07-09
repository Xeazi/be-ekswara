const express = require("express");
const {
  createInvoice,
  simulatePayment,
  createMidtransTransaction,
} = require("../../controllers/payments");

const router = express.Router();

// Endpoint untuk membuat invoice baru (Xendit)
router.post("/payments/invoices", createInvoice);

// Endpoint untuk mensimulasikan pembayaran pada payment request (Xendit)
router.post("/payments/invoices/:paymentRequestId/simulate", simulatePayment);

// Endpoint untuk membuat transaksi Midtrans
router.post("/payments/midtrans/transaction", createMidtransTransaction);

module.exports = router;
