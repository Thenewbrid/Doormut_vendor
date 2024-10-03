/** @format */

// models/OtpToken.js
const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema({
  rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
  },
  otp: String,
  type: {
    type: String,
    default: false,
  },
  expiration_time: Date,
  is_used: {
    type: Boolean,
    default: false,
  },
});

const OtpToken = mongoose.model("OtpToken", otpTokenSchema);

module.exports = OtpToken;
