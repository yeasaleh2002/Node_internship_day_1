const express = require('express');
const router = express.Router();
const db = require('../../models');
const { Op } = require('sequelize');

router.get('/all', async (req, res) => {
  try {
    const orders = await db.reports.findAll();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/report/sale?month=1&year=2022
// GET /api/v1/report/sale?from_date=2022-01-01&to_date=2022-02-02
router.get('/sale', async (req, res) => {
  const { month, year, from_date, to_date } = req.query;

  if (month && year) {
    // If month and year are provided, calculate total amount based on month and year
    try {
      const totalAmount = await db.reports.sum('amount', {
        where: {
          month,
          year,
        }
      });
      res.json({ totalAmount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else if (from_date && to_date) {
    // If from_date and to_date are provided, calculate total amount within date range
    // Parse the dates
    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);

    // Check if the dates are valid
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    try {
      // Query to calculate total amount within the date range
      const totalAmount = await db.reports.sum('amount', {
        where: {
          createdAt: {
            [Op.between]: [fromDate, toDate]
          }
        }
      });

      res.json({ totalAmount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // If neither month/year nor from_date/to_date provided, return error
    res.status(400).json({ error: 'Invalid or missing parameters' });
  }
});


// GET /api/v1/report/monthly?year=2022
router.get('/monthly', async (req, res) => {
  const { year } = req.query;
  try {
    const monthlySales = await db.reports.findAll({
      attributes: [
        'month',
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount']
      ],
      where: { year },
      group: ['month'],
      having: db.sequelize.literal('totalAmount > 0')
    });
    res.json(monthlySales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/report/user?year=2022&user_id=1
router.get('/user', async (req, res) => {
  const { year, user_id } = req.query;
  try {
    const userSales = await db.reports.findAll({
      attributes: [
        'month',
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount']
      ],
      where: {
        year,
        user_id
      },
      group: ['month'],
      having: db.sequelize.literal('totalAmount > 0')
    });
    res.json(userSales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
router.get('/shipping_dock', async (req, res) => {
  const { year, shipping_dock_id } = req.query;
  try {
    const dockSales = await db.reports.findAll({
      attributes: [
        'month',
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount']
      ],
      where: {
        year,
        shipping_dock_id
      },
      group: ['month'],
      having: db.sequelize.literal('totalAmount > 0')
    });
    res.json(dockSales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/report/user/count?year=2022&user_id=1
router.get('/user/count', async (req, res) => {
  const { year, user_id } = req.query;
  try {
    const userOrderCount = await db.reports.findAll({
      attributes: [
        'month',
        [db.sequelize.fn('COUNT', db.sequelize.col('order_count')), 'order_count']
      ],
      where: {
        year,
        user_id
      },
      group: ['month']
    });
    res.json(userOrderCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
