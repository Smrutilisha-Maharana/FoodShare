const Donation = require("../models/Donation");
const DonationRequest = require("../models/DonationRequest");

// DONOR: Dashboard statistics and recent donations
exports.getDonorDashboard = async (req, res) => {
try {
const donorId = req.user._id;


const [
  totalDonations,
  availableDonations,
  requestedDonations,
  collectedDonations,
  recentDonations,
] = await Promise.all([
  Donation.countDocuments({ donor: donorId }),

  Donation.countDocuments({
    donor: donorId,
    status: "available",
  }),

  Donation.countDocuments({
    donor: donorId,
    status: "requested",
  }),

  Donation.countDocuments({
    donor: donorId,
    status: "collected",
  }),

  Donation.find({ donor: donorId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean(),
]);

let expiredDonations = await Donation.countDocuments({
  donor: donorId,
  status: "expired",
});

// Also account for available donations whose expiry time has passed.
const timeExpiredAvailable = await Donation.countDocuments({
  donor: donorId,
  status: "available",
  expiryTime: { $lte: new Date() },
});

expiredDonations += timeExpiredAvailable;

return res.status(200).json({
  success: true,
  stats: {
    totalDonations,
    availableDonations,
    requestedDonations,
    collectedDonations,
    expiredDonations,
  },
  recentDonations,
});


} catch (error) {
console.error("Donor dashboard error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to load donor dashboard.",
});


}
};
