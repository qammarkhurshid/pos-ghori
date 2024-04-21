const express = require('express');
const router = express.Router();
const GuestCart = require('../models/cart.model');

// Create a new guest cart
router.post('/', async (req, res) => {
  try {
    const { cartId, items } = req.body;
    const guestCart = new GuestCart({ cartId, items });
    await guestCart.save();
    res.status(201).json(guestCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a guest cart by cartId
router.get('/:cartId', async (req, res) => {
  try {
    const guestCart = await GuestCart.findOne({ cartId: req.params.cartId });
    if (!guestCart) {
      return res.status(404).json({ error: 'Guest cart not found' });
    }
    res.json(guestCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a guest cart by cartId
router.put('/:cartId', async (req, res) => {
  try {
    const { items } = req.body;
    const guestCart = await GuestCart.findOneAndUpdate({ cartId: req.params.cartId }, { items }, { new: true });
    if (!guestCart) {
      return res.status(404).json({ error: 'Guest cart not found' });
    }
    res.json(guestCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a guest cart by cartId
router.delete('/:cartId', async (req, res) => {
  try {
    const guestCart = await GuestCart.findOneAndDelete({ cartId: req.params.cartId });
    if (!guestCart) {
      return res.status(404).json({ error: 'Guest cart not found' });
    }
    res.json({ message: 'Guest cart deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
