const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    type: {
      type: String,
      required: [true, 'Please add a product type'],
      enum: ['phone', 'tablet', 'laptop', 'accessory'],
      default: 'phone'
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative']
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    warranty_years: {
      type: Number,
      min: [0, 'Warranty cannot be negative'],
      max: [10, 'Warranty cannot exceed 10 years'],
      default: 1
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);