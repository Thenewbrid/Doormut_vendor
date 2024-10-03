/** @format */
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    flu_tnx_id: {
      type: String,
      // required: true,
    },
    user_id: {
      type: String,
      // required: true,
    },
    vendor_id: {
      type: String,
      // required: true,
    },
    products: {
      type: Object,
    },
    paid: {
      type: Boolean,
      // required: true,
    },
    routed_to: {
      type: String,
      // required: true,
    },
    delivery_type: {
      type: String,
      default: "Delivery",
    },
    no_of_canceled_request: {
      type: String,
      // require: true,
    },
    total: {
      type: Number,
      // require: true,
    },
    delivered: {
      type: Boolean,
      // require: true,
    },
    received: {
      type: Boolean,
      // require: true,
    },
    confirmation_code: {
      type: Number,
      // require: true,

      // (this is for the rider to confirm the transaction with the customer, so the customer and rider should have this code. e.g CUS_1905a)
    },
    status: {
      type: String,
      default: "WITH THE VENDOR",

      // this should basically have 4 values only ("with the vendor", "with a rider", "waiting for your confirmation", and "delivered") - and the default is “WITH THE VENDOR” -  check your note to get more
    },
    available: {
      type: Boolean,
      default: true,

      // it is true by default, and once the rider has picked up the item, the vendor should turn this false, else other riders will come looking for the same item since it’s available. So in the riders raider, once any item availability is true, they get an alert. So in a case where there are many items for a single user, that means it will all have the same tranx_code; and the first of them that gets to be unavailable, then all is unavailable.
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", userSchema);
module.exports = Transaction;
