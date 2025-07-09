const query = require("../database");

/**
 * Create a new order in the database
 */
async function createOrder(orderData) {
  try {
    const {
      orderId,
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      visitDate,
      ticketQuantity,
      eventTime,
      grossAmount,
      paymentStatus,
      items,
    } = orderData;

    // Insert order
    const orderQuery = `
      INSERT INTO orders (
        order_id, event_id, customer_name, customer_email, customer_phone,
        visit_date, ticket_quantity, event_time, gross_amount, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      orderId,
      eventId || null,
      customerName,
      customerEmail,
      customerPhone || null,
      visitDate || null,
      ticketQuantity || 1,
      eventTime || null,
      grossAmount,
      paymentStatus || "pending",
    ];

    await query(orderQuery, orderValues);

    // Insert order items if provided
    if (items && items.length > 0) {
      const itemsQuery = `
        INSERT INTO order_items (order_id, item_id, item_name, quantity, price)
        VALUES ?
      `;

      const itemsValues = items.map((item) => [
        orderId,
        item.id,
        item.name,
        item.quantity || 1,
        item.price,
      ]);

      await query(itemsQuery, [itemsValues]);
    }

    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Get order by order ID
 */
async function getOrderById(orderId) {
  try {
    const orderQuery = `
      SELECT o.*, e.name as event_name, e.description as event_description,
             d.name as destination_name
      FROM orders o
      LEFT JOIN events e ON o.event_id = e.id
      LEFT JOIN destinations d ON e.destination_id = d.id
      WHERE o.order_id = ?
    `;

    const orderResult = await query(orderQuery, [orderId]);

    if (orderResult.length === 0) {
      return null;
    }

    const order = orderResult[0];

    // Get order items
    const itemsQuery = `
      SELECT * FROM order_items WHERE order_id = ?
    `;
    const items = await query(itemsQuery, [orderId]);

    return {
      ...order,
      items,
    };
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
}

/**
 * Update order payment status
 */
async function updateOrderPaymentStatus(orderId, paymentData) {
  try {
    const {
      paymentStatus,
      paymentType,
      transactionId,
      transactionTime,
      midtransResponse,
    } = paymentData;

    const updateQuery = `
      UPDATE orders 
      SET payment_status = ?, payment_type = ?, transaction_id = ?, 
          transaction_time = ?, midtrans_response = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ?
    `;

    const values = [
      paymentStatus,
      paymentType || null,
      transactionId || null,
      transactionTime || null,
      midtransResponse ? JSON.stringify(midtransResponse) : null,
      orderId,
    ];

    const result = await query(updateQuery, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating order payment status:", error);
    throw error;
  }
}

/**
 * Mark order email as sent
 */
async function markEmailSent(orderId) {
  try {
    const updateQuery = `
      UPDATE orders SET email_sent = TRUE WHERE order_id = ?
    `;

    const result = await query(updateQuery, [orderId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error marking email as sent:", error);
    throw error;
  }
}

/**
 * Get orders by customer email
 */
async function getOrdersByCustomerEmail(customerEmail) {
  try {
    const ordersQuery = `
      SELECT o.*, e.name as event_name, d.name as destination_name
      FROM orders o
      LEFT JOIN events e ON o.event_id = e.id
      LEFT JOIN destinations d ON e.destination_id = d.id
      WHERE o.customer_email = ?
      ORDER BY o.created_at DESC
    `;

    const orders = await query(ordersQuery, [customerEmail]);
    return orders;
  } catch (error) {
    console.error("Error getting orders by customer email:", error);
    throw error;
  }
}

/**
 * Get orders by payment status
 */
async function getOrdersByStatus(paymentStatus) {
  try {
    const ordersQuery = `
      SELECT o.*, e.name as event_name, d.name as destination_name
      FROM orders o
      LEFT JOIN events e ON o.event_id = e.id
      LEFT JOIN destinations d ON e.destination_id = d.id
      WHERE o.payment_status = ?
      ORDER BY o.created_at DESC
    `;

    const orders = await query(ordersQuery, [paymentStatus]);
    return orders;
  } catch (error) {
    console.error("Error getting orders by status:", error);
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderPaymentStatus,
  markEmailSent,
  getOrdersByCustomerEmail,
  getOrdersByStatus,
};
