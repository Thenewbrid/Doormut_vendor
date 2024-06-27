const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const timeSchema = new mongoose.Schema(
  {
    openingTime: {
      type: String,
      required: false,
    },
    closingTime: {
      type: String,
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

const Time = mongoose.model("Time", timeSchema);

module.exports = Time;
