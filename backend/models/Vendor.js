const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const median = require("../calc/median");

const vendorSchema = new mongoose.Schema(
  {
    // vendor_name: { type: String, required: false },
    // vendor_phone: {
    //   type: String,
    //   required: false,
    // },
    // vendor_email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    // },
    store_name: {
      type: String,
      required: true,
    },
    store_id: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
    store_type: {
      type: String,
      required: true,
      enum: [
        "Supermarket",
        "Butchery",
        "Fruits and Vegetables",
        "Drinks and Liquor",
        "Pastery",
      ],
    },
    categories: [
      {
        category: { type: String, required: false },
      },
    ],
    scoring: [
      {
        userId: { type: String, required: false },
        rating: { type: Number, required: false },
        comment: { type: String, required: false },
      },
    ],
    staffs: [
      {
        name: { type: String, required: false },
        email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
        },
        phone: {
          type: String,
          required: false,
        },
        password: {
          type: String,
          required: true,
          default: bcrypt.hashSync("12335678"),
        },
        profileImg: {
          type: String,
          required: false,
        },
        is_active: {
          type: Boolean,
          default: true,
          required: true,
        },
        is_frozen: {
          type: Boolean,
          default: false,
          required: true,
        },
        role: {
          type: String,
          required: false,
          enum: [
            "Super Admin",
            "Admin",
            "Cashier",
            "Manager",
            "CEO",
            "Driver",
            "Security Guard",
            "Accountant",
          ],
        },
        joiningDate: {
          type: Date,
          required: false,
        },
      },
    ],
    store_address: {
      type: String,
      required: true,
    },
    store_coverImg: {
      type: String,
      required: false,
    },
    store_profileImg: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    is_frozen: {
      type: Boolean,
      default: false,
      required: true,
    },
    // auth_id: {
    //   type: String,
    //   required: true,
    //   uppercase: true,
    //   unique: true,
    // },
    // auth_password: {
    //   type: String,
    //   required: true,
    //   default: bcrypt.hashSync("12335678"),
    // },

    // joiningDate: {
    //   type: Date,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

vendorSchema.virtual("averageRating").get(function () {
  const ratings = this.scoring.map((rating) => rating.rating);
  const sum = ratings.reduce((acc, current) => acc + current, 0);
  const count = ratings.length;
  return sum / count;
});

vendorSchema.methods.freeze = function () {
  this.is_frozen = true;
  return this.save();
};

vendorSchema.methods.unfreeze = function () {
  this.is_frozen = false;
  return this.save();
};

vendorSchema.methods.activate = function () {
  this.is_active = true;
  return this.save();
};

vendorSchema.methods.deactivate = function () {
  this.is_active = false;
  return this.save();
};

vendorSchema.set("toJSON", { virtuals: true });

const Vendor = mongoose.model("W-Vendor", vendorSchema);

module.exports = Vendor;

// what are the vendors using to login. (id or eamil)
// id of the vendor is needed to login as a staff
