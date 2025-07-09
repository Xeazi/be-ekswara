const paymentService = require("../services/payments");
const midtransService = require("../services/midtrans");

const createInvoice = async (req, res) => {
  try {
    // Data ini akan dikirim dari frontend
    const { externalID, amount, payerEmail, description } = req.body;

    if (!externalID || !amount || !payerEmail || !description) {
      return res
        .status(400)
        .json({ message: "Missing required fields for invoice creation." });
    }

    const invoice = await paymentService.createInvoice({
      externalID,
      amount,
      payerEmail,
      description,
    });

    // Kirim kembali URL invoice ke frontend
    res.status(201).json({ invoiceURL: invoice.invoice_url, id: invoice.id });
  } catch (error) {
    console.error("Error creating Midtrans invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};

const simulatePayment = async (req, res) => {
  try {
    const { paymentRequestId } = req.params; // Ambil ID dari URL
    const { amount } = req.body; // Ambil amount dari body request

    if (!paymentRequestId || !amount) {
      return res.status(400).json({
        message: "Missing paymentRequestId or amount for simulation.",
      });
    }

    const simulationResult = await paymentService.simulatePayment({
      paymentRequestId,
      amount,
    });

    res.status(200).json({
      message: "Payment simulation successful",
      data: simulationResult,
    });
  } catch (error) {
    console.error("Error simulating payment in controller:", error);
    res
      .status(500)
      .json({ message: "Failed to simulate payment", error: error.message });
  }
};

const createMidtransTransaction = async (req, res) => {
  try {
    const {
      orderId,
      grossAmount,
      customerName,
      customerEmail,
      customerPhone,
      items,
    } = req.body;

    if (!orderId || !grossAmount || !customerName || !customerEmail) {
      return res
        .status(400)
        .json({ message: "Missing required fields for Midtrans transaction." });
    }

    // Menggunakan simulateTransaction untuk testing
    const transaction = await midtransService.simulateTransaction({
      orderId,
      grossAmount,
      customerName,
      customerEmail,
      customerPhone,
      items,
    });

    res.status(201).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      raw_response: transaction.raw_response,
    });
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    res.status(500).json({
      message: "Failed to create Midtrans transaction",
      error: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  simulatePayment,
  createMidtransTransaction,
};
