const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      enum: ["serving","kg", "items", "packets", "litres","boxs"],
      required:true,
    },

    foodType: {
  type: String,
  enum: [
    "Prepared Food",
    "Fruits & Vegetables",
    "Bakery Items",
    "Packaged Food",
    "Dairy Products",
    "Other",
  ],
  required: true,
},

    preparedAt: {
      type: Date,
      required: false,
    },

    expiryTime: {
      type: Date,
      required: true,
    },

    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "requested", "collected", "expired"],
      default: "available",
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);