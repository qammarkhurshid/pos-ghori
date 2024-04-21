const mongoose = require('mongoose');

const guestCartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a pre-save hook to update the totalPrice field
guestCartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  next();
});

const GuestCart = mongoose.model('GuestCart', guestCartSchema);

module.exports = GuestCart;
