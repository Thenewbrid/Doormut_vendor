const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    // store_ids: [
    //   {
    //     type: String,
    //     required: false,
    //   },
    // ],
    storeType: [
      {
        type: String,
        required: false,
        enum: [
          "Supermarket",
          "Butchery",
          "Fruits and Vegetables",
          "Drinks and Liquor",
          "Pastery",
          "Cosmetics"
        ],
      },
    ],
    type: {
      type: String,
      required: false,
    },
    parentId: {
      type: String,
      required: false,
    },
    parentName: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },

    //item delete in bulk function if this is true
    delete: {
      type: Boolean,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

// module.exports = categorySchema;

const Category = mongoose.model("W-Category", categorySchema);
module.exports = Category;
