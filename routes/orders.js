const express = require('express');
const router = express.Router();
const GuestCart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Create an order from a guest cart
router.post('/', async (req, res) => {
  try {
    const { cartId, userInfo } = req.body;
    const guestCart = await GuestCart.findOne({ _id: cartId });

    if (!guestCart) {
      return res.status(404).json({ error: 'Guest cart not found' });
    }

    const { firstName, lastName, companyName, address, city, country, zipCode, mobileNumber, orderNotes } = userInfo;

    const order = new Order({
      items: guestCart.items,
      totalPrice: guestCart.totalPrice,
      userInfo: {
        firstName,
        lastName,
        companyName,
        address,
        city,
        country,
        zipCode,
        mobileNumber,
        orderNotes,
      },
    });

    await order.save();

    for (let i = 0; i < guestCart.items.length; i++) {
      const currentProduct = guestCart.items[i];
      const productDetails = await Product.findOne({ _id: currentProduct.productId });
      await Product.findOneAndUpdate(
        { _id: currentProduct.productId },
        { stockLeft: parseInt(productDetails.stockLeft - 1) }
      );
    }

    await GuestCart.findOneAndDelete({ cartId });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
