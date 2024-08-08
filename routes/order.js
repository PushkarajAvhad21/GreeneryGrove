const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.js');

// Create a new order
router.post('/:userId', orderController.createOrder);

// Get all orders
router.get('/:userId', orderController.showorderpage);

// Get orders for a specific user
router.get('/get/:userId', orderController.getUserOrders);
router.get('/get/admin/:nurseryId', orderController.getAdminOrders);
router.get('/get/admin/customer/:nurseryId', orderController.getCustomer);
// Get order by ID
// router.get('/orders/:orderId', orderController.getOrderById);

// Update order
router.put('/update/:userId', orderController.updateOrder);

// Delete order
router.delete('/delete/:userId', orderController.deleteOrder);

module.exports = router;
