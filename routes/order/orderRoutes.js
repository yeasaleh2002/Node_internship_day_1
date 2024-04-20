const express = require('express');
const router = express.Router();
const db = require('../../models');

// GET all orders
// router.get('/', async (req, res) => {
//   try {
//     const orders = await db.order.findAll();
//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error?.message });
//   }
// });

// GET all orders with odd order_id
router.get('/odd', async (req, res) => {
  try {
    console.log("Before query execution");
    const oddOrders = await db.sequelize.query(
      `SELECT * FROM orders WHERE MOD(order_id, 2) = 1`,
      { type: db.sequelize.QueryTypes.SELECT }
    );
    console.log("After query execution:", oddOrders);
    res.json(oddOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Pagination for orders
// router.get('/', async (req, res) => {
//   let { page = 1, limit = 10 } = req.query;
//   page = parseInt(page);
//   limit = parseInt(limit);
//   try {
//     const { count, rows } = await db.order.findAndCountAll({
//       offset: (page - 1) * limit,
//       limit
//     });

//     const totalPages = Math.ceil(count / limit);

//     // Ensure the page is within bounds
//     if (page < 1 || page > totalPages) {
//       return res.status(400).json({ error: 'Invalid page number' });
//     }

//     res.json({ total: count, page, totalPages, list: rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });


// Pagination with sorting for orders
router.get('/', async (req, res) => {
  let { page = 1, limit = 10, sort = 'order_id', direction = 'ASC' } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    // Validate direction
    if (!['ASC', 'DESC'].includes(direction.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid direction. Must be ASC or DESC.' });
    }

    // Offset calculation
    const offset = (page - 1) * limit;

    // Find and count orders with pagination and sorting
    const { count, rows } = await db.order.findAndCountAll({
      offset,
      limit,
      order: [[sort, direction]]
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Ensure the page is within bounds
    if (page < 1 || page > totalPages) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({ total: count, page, totalPages, list: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Pagination using cursor method
// http://localhost:5000/api/v1/order/cursor?order_id=2&limit=10
router.get('/cursor', async (req, res) => {
  const { order_id, limit = 10 } = req.query;
  try {
    const orders = await db.order.findAll({
      where: {
        order_id: { [db.Sequelize.Op.gt]: order_id }
      },
      limit: parseInt(limit) // Convert limit to integer
    });
    res.json({ order_id, list: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message });
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
    res.status(500).json({ error: error?.message });
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
    res.status(500).json({ error: error?.message });
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
    res.status(500).json({ error: error?.message });
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
    res.status(500).json({ error: error?.message });
  }
});


module.exports = router;