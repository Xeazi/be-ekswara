const paymentService = require("../services/payments");
const midtransService = require("../services/midtrans");
const emailService = require("../services/email");
const ordersService = require("../services/orders");
const crypto = require("crypto");

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
      eventId,
      visitDate,
      ticketQuantity,
      eventTime,
      items,
    } = req.body;

    if (!orderId || !grossAmount || !customerName || !customerEmail) {
      return res
        .status(400)
        .json({ message: "Missing required fields for Midtrans transaction." });
    }

    // Save order data to database
    await ordersService.createOrder({
      orderId,
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      visitDate,
      ticketQuantity,
      eventTime,
      grossAmount,
      paymentStatus: "pending",
      items,
    });

    console.log("Order data saved to database:", orderId);

    // Create Midtrans transaction
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

/**
 * Handle payment notification from Midtrans
 * Endpoint ini akan dipanggil oleh Midtrans ketika status pembayaran berubah
 */
const handlePaymentNotification = async (req, res) => {
  try {
    const notification = req.body;
    console.log("Received Midtrans notification:", notification);

    // Verifikasi signature untuk keamanan
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_time,
      payment_type,
    } = notification;

    // Buat signature untuk verifikasi
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    // Verifikasi signature
    if (hash !== signature_key) {
      console.error("Invalid signature from Midtrans notification");
      return res.status(401).json({ message: "Invalid signature" });
    }

    console.log("Midtrans notification verified successfully");
    console.log("Transaction status:", transaction_status);
    console.log("Fraud status:", fraud_status);

    // Proses berdasarkan status transaksi
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      // Pembayaran berhasil
      if (fraud_status === "accept" || fraud_status === undefined) {
        console.log("Payment successful for order:", order_id);

        // Update order status in database
        await ordersService.updateOrderPaymentStatus(order_id, {
          paymentStatus: "paid",
          paymentType: payment_type,
          transactionId: notification.transaction_id,
          transactionTime: transaction_time,
          midtransResponse: notification,
        });

        // Send ticket email automatically
        await sendTicketEmailFromOrder(order_id, notification);

        return res
          .status(200)
          .json({ message: "Payment processed successfully" });
      }
    } else if (transaction_status === "pending") {
      console.log("Payment pending for order:", order_id);

      // Update order status to pending
      await ordersService.updateOrderPaymentStatus(order_id, {
        paymentStatus: "pending",
        paymentType: payment_type,
        transactionId: notification.transaction_id,
        transactionTime: transaction_time,
        midtransResponse: notification,
      });

      return res.status(200).json({ message: "Payment pending" });
    } else if (
      transaction_status === "deny" ||
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      console.log("Payment failed/cancelled for order:", order_id);

      // Update order status to failed/cancelled
      let status = "failed";
      if (transaction_status === "expire") status = "expired";
      if (transaction_status === "cancel") status = "cancelled";

      await ordersService.updateOrderPaymentStatus(order_id, {
        paymentStatus: status,
        paymentType: payment_type,
        transactionId: notification.transaction_id,
        transactionTime: transaction_time,
        midtransResponse: notification,
      });

      return res.status(200).json({ message: "Payment failed" });
    }

    res.status(200).json({ message: "Notification received" });
  } catch (error) {
    console.error("Error handling payment notification:", error);
    res.status(500).json({
      message: "Error processing payment notification",
      error: error.message,
    });
  }
};

/**
 * Fungsi untuk mengirim email tiket berdasarkan order ID
 * Fungsi ini akan dipanggil setelah pembayaran berhasil
 */
const sendTicketEmailFromOrder = async (orderId, paymentNotification) => {
  try {
    // Get order data from database
    const orderData = await ordersService.getOrderById(orderId);

    if (!orderData) {
      console.error("Order data not found in database for:", orderId);
      return;
    }

    console.log("Retrieved order data from database:", orderData);

    // Determine destination name from order data
    let destination = orderData.destination_name || "Event Destination";
    let eventName = orderData.event_name || destination;
    let eventDescription =
      orderData.event_description ||
      `Tiket untuk ${destination} telah berhasil dibeli.`;

    // If no destination from database, try to get from order items
    if (
      !orderData.destination_name &&
      orderData.items &&
      orderData.items.length > 0
    ) {
      const mainItem = orderData.items.find(
        (item) => item.item_id !== "service-fee"
      );
      if (mainItem) {
        destination = mainItem.item_name;
        eventName = mainItem.item_name;
      }
    }

    const ticketData = {
      orderID: orderId,
      customerName: orderData.customer_name,
      customerEmail: orderData.customer_email,
      destination: destination,
      visitDate: orderData.visit_date
        ? new Date(orderData.visit_date).toLocaleDateString("id-ID")
        : new Date().toLocaleDateString("id-ID"),
      ticketQuantity: orderData.ticket_quantity || 1,
      eventTime: orderData.event_time || "09:00 - 17:00",
      totalPrice: parseInt(
        paymentNotification.gross_amount || orderData.gross_amount
      ),
      paymentStatus: "paid",
      eventName: eventName,
      eventDescription: eventDescription,
    };

    console.log("Sending ticket email for order:", orderId);
    const emailResult = await emailService.sendTicketEmail(ticketData);
    console.log("Ticket email sent successfully:", emailResult);

    // Mark email as sent in database
    await ordersService.markEmailSent(orderId);

    return emailResult;
  } catch (error) {
    console.error("Error sending ticket email:", error);
    // Don't throw error to avoid disrupting Midtrans response
    // Log error for monitoring
  }
};

/**
 * Manual endpoint untuk mengirim email tiket
 * Berguna untuk testing atau kirim ulang email
 */
const sendTicketEmailManual = async (req, res) => {
  try {
    const {
      orderID,
      customerName,
      customerEmail,
      destination,
      visitDate,
      ticketQuantity,
      eventTime,
      totalPrice,
      eventName,
      eventDescription,
    } = req.body;

    // Validasi data required
    if (
      !orderID ||
      !customerName ||
      !customerEmail ||
      !destination ||
      !totalPrice
    ) {
      return res.status(400).json({
        message: "Missing required fields for sending ticket email",
        required: [
          "orderID",
          "customerName",
          "customerEmail",
          "destination",
          "totalPrice",
        ],
      });
    }

    const ticketData = {
      orderID,
      customerName,
      customerEmail,
      destination,
      visitDate: visitDate || new Date().toLocaleDateString("id-ID"),
      ticketQuantity: ticketQuantity || 1,
      eventTime: eventTime || "09:00 - 17:00",
      totalPrice,
      paymentStatus: "paid",
      eventName,
      eventDescription,
    };

    const emailResult = await emailService.sendTicketEmail(ticketData);

    res.status(200).json({
      message: "Ticket email sent successfully",
      result: emailResult,
    });
  } catch (error) {
    console.error("Error sending manual ticket email:", error);
    res.status(500).json({
      message: "Failed to send ticket email",
      error: error.message,
    });
  }
};

/**
 * Test email configuration
 */
const testEmailConnection = async (req, res) => {
  try {
    const result = await emailService.testEmailConnection();
    res.status(200).json({
      message: "Email connection test",
      success: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Email connection test failed",
      error: error.message,
    });
  }
};

/**
 * Get order status by order ID
 */
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const orderData = await ordersService.getOrderById(orderId);

    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return only necessary information
    const orderStatus = {
      orderId: orderData.order_id,
      paymentStatus: orderData.payment_status,
      customerName: orderData.customer_name,
      customerEmail: orderData.customer_email,
      grossAmount: orderData.gross_amount,
      eventName: orderData.event_name,
      destinationName: orderData.destination_name,
      visitDate: orderData.visit_date,
      ticketQuantity: orderData.ticket_quantity,
      eventTime: orderData.event_time,
      emailSent: orderData.email_sent,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    };

    res.status(200).json({
      message: "Order status retrieved successfully",
      data: orderStatus,
    });
  } catch (error) {
    console.error("Error getting order status:", error);
    res.status(500).json({
      message: "Failed to get order status",
      error: error.message,
    });
  }
};

/**
 * Check transaction status from Midtrans and update database
 */
const checkTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Get transaction status from Midtrans
    const transactionStatus = await midtransService.getTransactionStatus(
      orderId
    );

    console.log("Retrieved transaction status:", transactionStatus);

    // Update order status in database based on Midtrans response
    const paymentData = {
      paymentStatus: getPaymentStatusFromMidtrans(
        transactionStatus.transaction_status,
        transactionStatus.fraud_status
      ),
      paymentType: transactionStatus.payment_type,
      transactionId: transactionStatus.transaction_id,
      transactionTime: transactionStatus.transaction_time,
      midtransResponse: transactionStatus,
    };

    await ordersService.updateOrderPaymentStatus(orderId, paymentData);

    // If payment is successful and email hasn't been sent, send it now
    if (
      (transactionStatus.transaction_status === "settlement" ||
        transactionStatus.transaction_status === "capture") &&
      (transactionStatus.fraud_status === "accept" ||
        !transactionStatus.fraud_status)
    ) {
      // Check if email has been sent
      const orderData = await ordersService.getOrderById(orderId);
      if (orderData && !orderData.email_sent) {
        console.log(
          "Payment confirmed, sending ticket email for order:",
          orderId
        );
        await sendTicketEmailFromOrder(orderId, transactionStatus);
      }
    }

    res.status(200).json({
      message: "Transaction status checked successfully",
      data: {
        orderId: orderId,
        transactionStatus: transactionStatus.transaction_status,
        paymentType: transactionStatus.payment_type,
        fraudStatus: transactionStatus.fraud_status,
        grossAmount: transactionStatus.gross_amount,
        transactionTime: transactionStatus.transaction_time,
        updatedPaymentStatus: paymentData.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    res.status(500).json({
      message: "Failed to check transaction status",
      error: error.message,
    });
  }
};

/**
 * Check transaction status from Midtrans and update database
 */
const checkAndUpdateTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    console.log("Checking transaction status for order:", orderId);

    // Get current order from database
    const orderData = await ordersService.getOrderById(orderId);
    if (!orderData) {
      return res.status(404).json({ message: "Order not found in database" });
    }

    // Get transaction status from Midtrans
    const midtransStatus = await midtransService.getTransactionStatus(orderId);

    console.log("Midtrans status response:", midtransStatus);

    // Map Midtrans status to our database status
    let newPaymentStatus = orderData.payment_status;
    let shouldSendEmail = false;

    switch (midtransStatus.transaction_status) {
      case "settlement":
      case "capture":
        if (
          midtransStatus.fraud_status === "accept" ||
          !midtransStatus.fraud_status
        ) {
          newPaymentStatus = "paid";
          shouldSendEmail = true;
        }
        break;
      case "pending":
        newPaymentStatus = "pending";
        break;
      case "deny":
        newPaymentStatus = "failed";
        break;
      case "cancel":
        newPaymentStatus = "cancelled";
        break;
      case "expire":
        newPaymentStatus = "expired";
        break;
    }

    // Update database if status changed
    if (newPaymentStatus !== orderData.payment_status) {
      console.log(
        `Updating order ${orderId} status from ${orderData.payment_status} to ${newPaymentStatus}`
      );

      await ordersService.updateOrderPaymentStatus(orderId, {
        paymentStatus: newPaymentStatus,
        paymentType: midtransStatus.payment_type,
        transactionId: midtransStatus.transaction_id,
        transactionTime: midtransStatus.transaction_time,
        midtransResponse: midtransStatus,
      });

      // Send email if payment is successful and email not sent yet
      if (shouldSendEmail && !orderData.email_sent) {
        console.log("Payment confirmed, sending ticket email...");
        await sendTicketEmailFromOrder(orderId, midtransStatus);
      }
    }

    res.status(200).json({
      message: "Transaction status checked and updated",
      data: {
        orderId,
        previousStatus: orderData.payment_status,
        currentStatus: newPaymentStatus,
        midtransResponse: midtransStatus,
        emailSent: shouldSendEmail && !orderData.email_sent,
      },
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    res.status(500).json({
      message: "Failed to check transaction status",
      error: error.message,
    });
  }
};

/**
 * Check all pending transactions and update their status
 */
const checkAllPendingTransactions = async (req, res) => {
  try {
    console.log("Checking all pending transactions...");

    // Get all pending orders from database
    const pendingOrders = await ordersService.getOrdersByStatus("pending");

    if (pendingOrders.length === 0) {
      return res.status(200).json({
        message: "No pending transactions found",
        data: { checkedCount: 0, updatedCount: 0 },
      });
    }

    console.log(`Found ${pendingOrders.length} pending transactions`);

    let updatedCount = 0;
    const results = [];

    for (const order of pendingOrders) {
      try {
        console.log(`Checking transaction status for order: ${order.order_id}`);

        // Get transaction status from Midtrans
        const transactionStatus = await midtransService.getTransactionStatus(
          order.order_id
        );

        const newPaymentStatus = getPaymentStatusFromMidtrans(
          transactionStatus.transaction_status,
          transactionStatus.fraud_status
        );

        // Update order status in database
        const paymentData = {
          paymentStatus: newPaymentStatus,
          paymentType: transactionStatus.payment_type,
          transactionId: transactionStatus.transaction_id,
          transactionTime: transactionStatus.transaction_time,
          midtransResponse: transactionStatus,
        };

        await ordersService.updateOrderPaymentStatus(
          order.order_id,
          paymentData
        );

        // If payment is successful and email hasn't been sent, send it now
        if (
          (transactionStatus.transaction_status === "settlement" ||
            transactionStatus.transaction_status === "capture") &&
          (transactionStatus.fraud_status === "accept" ||
            !transactionStatus.fraud_status) &&
          !order.email_sent
        ) {
          console.log(
            `Payment confirmed, sending ticket email for order: ${order.order_id}`
          );
          await sendTicketEmailFromOrder(order.order_id, transactionStatus);
        }

        updatedCount++;
        results.push({
          orderId: order.order_id,
          oldStatus: "pending",
          newStatus: newPaymentStatus,
          transactionStatus: transactionStatus.transaction_status,
          emailSent:
            !order.email_sent &&
            (transactionStatus.transaction_status === "settlement" ||
              transactionStatus.transaction_status === "capture"),
        });
      } catch (error) {
        console.error(`Error checking transaction ${order.order_id}:`, error);
        results.push({
          orderId: order.order_id,
          error: error.message,
        });
      }

      // Add small delay to avoid hitting API rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    res.status(200).json({
      message: `Checked ${pendingOrders.length} pending transactions, updated ${updatedCount}`,
      data: {
        checkedCount: pendingOrders.length,
        updatedCount: updatedCount,
        results: results,
      },
    });
  } catch (error) {
    console.error("Error checking pending transactions:", error);
    res.status(500).json({
      message: "Failed to check pending transactions",
      error: error.message,
    });
  }
};

/**
 * Helper function to convert Midtrans transaction status to database payment status
 */
const getPaymentStatusFromMidtrans = (transactionStatus, fraudStatus) => {
  if (transactionStatus === "settlement" || transactionStatus === "capture") {
    if (fraudStatus === "accept" || !fraudStatus) {
      return "paid";
    }
  }

  if (transactionStatus === "pending") {
    return "pending";
  }

  if (transactionStatus === "deny") {
    return "failed";
  }

  if (transactionStatus === "expire") {
    return "expired";
  }

  if (transactionStatus === "cancel") {
    return "cancelled";
  }

  return "pending"; // Default fallback
};

module.exports = {
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
};
