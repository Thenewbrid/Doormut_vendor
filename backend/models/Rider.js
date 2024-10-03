/** @format */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const riderSchema = mongoose.Schema(
  {
    riderId: String,
    first_name: {
      type: String,
      // required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    other_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    phone_number: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    home_address: {
      type: String,
      // required: true,
    },
    location: {
      type: String,
      // required: false,
    },
    profile_image: {
      type: String,
      // required: false,
    },
    personal_document: {
      id_type: {
        type: String,
        // required: true,
      },

      document: {
        type: String,
        // required: true,
      },

      expiry_date: {
        type: String,
        // required: true,
      },

      have_a_vehicle: {
        type: Boolean,
        // required: true,
      },
    },

    vehicles: [
      {
        vehicle_info: {
          vehicle_type: String,
          brand: String,
          model: String,
          year: String,
          color: String,
          document_1: String,
        },
        vehicle_document: {
          drivers_license: String,
          proof_of_ownership: String,
          cert_of_road_worthiness: String,
          insurance_cert: String,
        },
      },
    ],

    // password: {
    // 	type: String,
    // 	// required: true,
    // },

    isSuspended: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    online: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// login
riderSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// register rider
riderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Rider = mongoose.model("Rider", riderSchema);
module.exports = Rider;
