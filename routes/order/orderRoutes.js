const express = require('express');
const router = express.Router();
const db = require('../../models');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await db.order.findAll();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET a single order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  const { user_id, amount, tax, notes, status } = req.body;
  try {
    const newOrder = await db.order.create({ user_id, amount, tax, notes, status });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// PUT update an existing order
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, amount, tax, notes, status } = req.body;
  try {
    const order = await db.order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.update({ user_id, amount, tax, notes, status });
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE an order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
