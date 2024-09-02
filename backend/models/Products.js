const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    store_id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    prices: {
      type: Object,
      required: true,
      properties: {
        unitPrice: {
          type: Number,
          required: true,
        },
        packPrice: {
          type: Number,
          default: null,
        },
      },
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
      required: true,
    },
    categories: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: null,
    },
    isCombination: {
      type: Boolean,
      required: true,
      default: false,
    },
    variantType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
