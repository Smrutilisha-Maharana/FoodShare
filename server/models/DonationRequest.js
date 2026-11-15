const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "collected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DonationRequest", donationRequestSchema);