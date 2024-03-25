const express = require('express');
const router = express.Router();
const db = require('../../models');
const { Op } = require('sequelize');

// GET /api/v1/report/sale?month=1&year=2022
router.get('/sale', async (req, res) => {
  const { month, year } = req.query;

  // Check if month is provided and is a valid number between 1 and 12
  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  // Proceed with the query if month is valid
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
});


// GET /api/v1/report/sale?from_date=2022-01-01&to_date=2022-02-02
// router.get('/sale', async (req, res) => {
//   const { from_date, to_date } = req.query;
//   try {
//     const totalAmount = await db.reports.sum('amount', {
//       where: {
//         createdAt: {
//           [Op.between]: [from_date, to_date]
//         }
//       }
//     });
//     res.json({ totalAmount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// GET /api/v1/report/monthly?year=2022
router.get('/monthly', async (req, res) => {
  const { year } = req.query;
  try {
    const monthlySales = await db.Report.findAll({
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
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/v1/report/user?year=2022&user_id=1
router.get('/user', async (req, res) => {
  const { year, user_id } = req.query;
  try {
    const userSales = await db.Report.findAll({
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
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
router.get('/shipping_dock', async (req, res) => {
  const { year, shipping_dock_id } = req.query;
  try {
    const dockSales = await db.Report.findAll({
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
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/v1/report/user/count?year=2022&user_id=1
router.get('/user/count', async (req, res) => {
  const { year, user_id } = req.query;
  try {
    const userOrderCount = await db.Report.findAll({
      attributes: [
        'month',
        [db.sequelize.fn('COUNT', db.sequelize.col('order_id')), 'orderCount']
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
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
