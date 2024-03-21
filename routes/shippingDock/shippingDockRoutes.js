const express = require('express');
const router = express.Router();
const { shipping_dock } = require('../../models'); 

// GET all shipping docks
router.get('/', async (req, res) => {
  try {
    const docks = await shipping_dock.findAll();
    res.json(docks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET one shipping dock by ID
router.get('/:id', async (req, res) => {
  try {
    const dock = await shipping_dock.findByPk(req.params.id);
    if (!dock) return res.status(404).json({ message: 'Dock not found' });
    res.json(dock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new shipping dock
router.post('/', async (req, res) => {
  console.log("req", req.body)
  try {
    const dock = await shipping_dock.create(req.body);
    res.status(201).json(dock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// PUT update a shipping dock by ID
router.put('/:id', async (req, res) => {
  try {
    const dock = await shipping_dock.findByPk(req.params.id);
    if (!dock) return res.status(404).json({ message: 'Dock not found' });

    await dock.update(req.body);
    res.json(dock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE a shipping dock by ID
router.delete('/:id', async (req, res) => {
  try {
    const dock = await shipping_dock.findByPk(req.params.id);
    if (!dock) return res.status(404).json({ message: 'Dock not found' });

    await dock.destroy();
    res.json({ message: 'Dock deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
