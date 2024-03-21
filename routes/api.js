const express = require('express');
const router = express.Router();

const shippingDockRoutes = require('./shippingDock/shippingDockRoutes');
const orderRoutes = require('./order/orderRoutes');
const transactionRoutes = require('./transaction/transactionRoutes');
// Import other routes as needed

// Mount routes from each module
router.use('/shipping_dock', shippingDockRoutes);
router.use('/order', orderRoutes);
router.use('/transaction', transactionRoutes);
// Mount other routes as needed

module.exports = router;
