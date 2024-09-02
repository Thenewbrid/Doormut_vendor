const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: Object,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    couponCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: true,
    },
    useCount: {
      type: Number,
      required: false,
      default: 0
    },
    limit: {
      type: Number,
      required: false,
      default: null //null means unlimited
    },
    // active:{
    //   type:Boolean,
    //   required:false,
    // },
    discountType: {
      type: Object,
      required: false,
    },
    minimumAmount: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = couponSchema;

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
