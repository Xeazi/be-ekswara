require("dotenv").config();
const midtransClient = require("midtrans-client");
const axios = require("axios");

// Create Snap API instance sesuai dokumentasi Midtrans
let snap = new midtransClient.Snap({
  isProduction: false, // Set ke true untuk production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

/**
 * Membuat transaksi Midtrans menggunakan Snap API
 * @param {object} data - Data untuk membuat transaksi
 * @returns {Promise<object>} - Transaksi yang telah dibuat dengan token
 */
const createTransaction = async ({
  orderId,
  grossAmount,
  customerName,
  customerEmail,
  customerPhone,
  items,
}) => {
  try {
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone || "08123456789",
      },
    };

    // Tambahkan item_details jika ada
    if (items && items.length > 0) {
      parameter.item_details = items;
    }

    console.log(
      "Creating Midtrans transaction with parameter:",
      JSON.stringify(parameter, null, 2)
    );

    // Menggunakan createTransaction sesuai dokumentasi
    const transaction = await snap.createTransaction(parameter);

    console.log("Midtrans transaction created successfully:", transaction);

    // Return token dan redirect_url
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    };
  } catch (error) {
    console.error("Error creating Midtrans transaction in service:", error);
    console.error("Error details:", error.response?.data || error.message);
    throw new Error(`Midtrans Error: ${error.message}`);
  }
};

/**
 * Simulasi transaksi langsung ke endpoint Midtrans
 * @param {object} data - Data untuk membuat transaksi
 * @returns {Promise<object>} - Response dari Midtrans
 */
const simulateTransaction = async ({
  orderId,
  grossAmount,
  customerName,
  customerEmail,
  customerPhone,
  items,
}) => {
  try {
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone || "08123456789",
      },
    };

    if (items && items.length > 0) {
      parameter.item_details = items;
    }

    // Encode server key untuk Authorization header
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const encodedServerKey = Buffer.from(serverKey + ":").toString("base64");

    console.log(
      "Sending simulation request to Midtrans:",
      JSON.stringify(parameter, null, 2)
    );

    // Request langsung ke endpoint simulasi Midtrans
    const response = await axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      parameter,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedServerKey}`,
        },
      }
    );

    console.log("Midtrans simulation response:", response.data);

    return {
      token: response.data.token,
      redirect_url: response.data.redirect_url,
      raw_response: response.data,
    };
  } catch (error) {
    console.error("Error in Midtrans simulation:", error);
    console.error("Error response:", error.response?.data);
    throw new Error(
      `Midtrans Simulation Error: ${
        error.response?.data?.error_messages || error.message
      }`
    );
  }
};

/**
 * Alternative: Hanya membuat transaction token
 * @param {object} data - Data untuk membuat transaksi
 * @returns {Promise<string>} - Transaction token
 */
const createTransactionToken = async ({
  orderId,
  grossAmount,
  customerName,
  customerEmail,
  customerPhone,
  items,
}) => {
  try {
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone || "08123456789",
      },
    };

    if (items && items.length > 0) {
      parameter.item_details = items;
    }

    // Menggunakan createTransactionToken untuk hanya mendapatkan token
    const transactionToken = await snap.createTransactionToken(parameter);

    return transactionToken;
  } catch (error) {
    console.error("Error creating Midtrans transaction token:", error);
    throw new Error(`Midtrans Error: ${error.message}`);
  }
};

/**
 * Get status of transaction that already recorded on Midtrans
 * @param {string} orderId - Order ID or Transaction ID
 * @returns {Promise<object>} - Transaction status response
 */
const getTransactionStatus = async (orderId) => {
  try {
    console.log("Getting transaction status for order:", orderId);

    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.MIDTRANS_SERVER_KEY + ":"
        ).toString("base64")}`,
      },
    };

    const response = await fetch(url, options);
    const json = await response.json();

    console.log("Transaction status response:", json);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${json.status_message || "Unknown error"}`
      );
    }

    return json;
  } catch (error) {
    console.error("Error getting transaction status:", error);
    throw error;
  }
};

/**
 * Approve a credit card transaction with 'challenge' fraud status
 * @param {string} orderId - Order ID or Transaction ID
 * @returns {Promise<object>} - Approval response
 */
const approveTransaction = async (orderId) => {
  try {
    console.log("Approving transaction for order:", orderId);

    const response = await snap.transaction.approve(orderId);

    console.log("Transaction approval response:", response);

    return response;
  } catch (error) {
    console.error("Error approving transaction:", error);
    throw error;
  }
};

module.exports = {
  createTransaction,
  createTransactionToken,
  simulateTransaction,
  getTransactionStatus,
  approveTransaction,
};
