const User = require("../models/User");

// List all registered NGO accounts
exports.getNGOs = async (req, res) => {
try {
const ngos = await User.find({ role: "ngo" })
.select("-password")
.sort({ createdAt: -1 })
.lean();


res.status(200).json({
  success: true,
  count: ngos.length,
  ngos,
});


} catch (error) {
console.error("Get NGOs error:", error.message);


res.status(500).json({
  success: false,
  message: "Failed to fetch NGO applications",
});


}
};

// Approve or reject an NGO
exports.updateNGOVerification = async (req, res) => {
try {
const { status } = req.body;


if (!["verified", "rejected"].includes(status)) {
  return res.status(400).json({
    success: false,
    message: "Status must be verified or rejected",
  });
}

const ngo = await User.findOne({
  _id: req.params.id,
  role: "ngo",
});

if (!ngo) {
  return res.status(404).json({
    success: false,
    message: "NGO account not found",
  });
}

ngo.isVerified = status === "verified";
ngo.verificationStatus = status;

await ngo.save();

res.status(200).json({
  success: true,
  message:
    status === "verified"
      ? "NGO verified successfully"
      : "NGO application rejected",
  ngo: {
    _id: ngo._id,
    name: ngo.name,
    email: ngo.email,
    phone: ngo.phone,
    role: ngo.role,
    isVerified: ngo.isVerified,
    verificationStatus: ngo.verificationStatus,
  },
});


} catch (error) {
console.error("Update NGO verification error:", error.message);


res.status(500).json({
  success: false,
  message: "Failed to update NGO verification",
});


}
};
