
const User = require("../models/User");
const Donation = require("../models/Donation");
const DonationRequest = require("../models/DonationRequest");
const mongoose = require("mongoose");

// ADMIN: Dashboard overview
exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalNGOs,
      totalAdmins,
      totalDonations,
      availableDonations,
      requestedDonations,
      collectedDonations,
      expiredDonations,
      pendingNGOs,
      recentUsers,
      recentDonations,
      totalRequests,
      pendingRequests,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "ngo" }),
      User.countDocuments({ role: "admin" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "available" }),
      Donation.countDocuments({ status: "requested" }),
      Donation.countDocuments({ status: "collected" }),
      Donation.countDocuments({ status: "expired" }),
      User.countDocuments({
        role: "ngo",
        verificationStatus: "pending",
      }),
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Donation.find()
        .populate("donor", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      DonationRequest.countDocuments(),
      DonationRequest.countDocuments({ status: "pending" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalNGOs,
        totalAdmins,
        totalDonations,
        availableDonations,
        requestedDonations,
        collectedDonations,
        expiredDonations,
        pendingNGOs,
        totalRequests,
        pendingRequests,
      },
      recentUsers,
      recentDonations,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
    });
  }
};

// ADMIN: Get all NGOs
exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    console.error("Get NGOs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NGOs.",
    });
  }
};

// ADMIN: Verify NGO
exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NGO ID.",
      });
    }

    const ngo = await User.findOne({
      _id: id,
      role: "ngo",
    });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found.",
      });
    }

    ngo.isVerified = true;
    ngo.verificationStatus = "verified";

    await ngo.save();

    return res.status(200).json({
      success: true,
      message: "NGO verified successfully.",
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        role: ngo.role,
        isVerified: ngo.isVerified,
        verificationStatus: ngo.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Verify NGO error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify NGO.",
    });
  }
};

// ADMIN: Get Donors and Receivers for verification
exports.getUsersForVerification = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["donor", "receiver"] },
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users for verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

// ADMIN: Verify or reject a user
exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status.",
      });
    }

    const user = await User.findOne({
      _id: id,
      role: { $in: ["donor", "receiver"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isVerified = status === "verified";
    user.verificationStatus = status;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${status} successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Verify user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user verification.",
    });
  }
};

