const express = require('express');
const router = express.Router();
const db = require('../../models');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await db.transaction.findAll();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET a single transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await db.transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const { order_id, user_id, shipping_dock_id, amount, notes } = req.body;
  try {
    const newTransaction = await db.transaction.create({ order_id, user_id, shipping_dock_id, amount, notes });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// PUT update an existing transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { order_id, user_id, shipping_dock_id, amount, notes } = req.body;
  try {
    const transaction = await db.transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.update({ order_id, user_id, shipping_dock_id, amount, notes });
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await db.transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
