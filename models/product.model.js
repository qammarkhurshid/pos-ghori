const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    totalStock: {
      type: Number,
      required: true,
      default: 0,
    },
    stockLeft: {
      type: Number,
      required: true,
      default: 0,
    },
    dateOrdered: {
      type: Date,
      required: true,
      default: new Date(),
    },
    category: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Adding a pre-save hook to update the updatedAt field
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
