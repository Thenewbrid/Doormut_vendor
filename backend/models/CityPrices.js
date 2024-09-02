const mongoose = require("mongoose");

const cityPriceSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  pricePerKM: {
    type: Number,
    required: true,
  },
  serviceCharge: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("CityPrice", cityPriceSchema);
