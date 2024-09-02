const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: Object,
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
    store_ids: [
      {
        type: String,
        required: false,
      },
    ],
    storeType: {
      type: String,
      required: false,
      enum: [
        "Supermarket",
        "Butchery",
        "Fruits and Vegetables",
        "Drinks and Liquor",
        "Pastery",
      ],
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
  },
  {
    timestamps: true,
  }
);

// module.exports = categorySchema;

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
