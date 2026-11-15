
const Donation = require("../models/Donation");

// ========================================
// 1. CREATE A DONATION
// POST /api/donations
// ========================================
exports.createDonation = async (req, res) => {
  try {
    const {
      foodName,
      title,
      description,
      quantity,
      unit,
      foodType,
      preparedAt,
      expiryTime,
      expiryDate,
      pickupAddress,
      contactPhone,
    } = req.body;

    // Support both foodName and title
    const finalFoodName = foodName || title;

    // Support both expiryTime and expiryDate
    const finalExpiryTime = expiryTime || expiryDate;

    // Validate required fields
    if (
      !finalFoodName ||
      !description ||
      quantity === undefined ||
      quantity === "" ||
      !unit ||
      !foodType ||
      !finalExpiryTime ||
      !pickupAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required donation details.",
      });
    }

    // Validate quantity
    const numericQuantity = Number(quantity);

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero.",
      });
    }

    // These values must match the unit enum in Donation.js
    const validUnits = [
      "serving",
      "kg",
      "packets",
      "boxs",
      "items"
    ];

    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        success: false,
        message: `Invalid unit '${unit}'. Allowed units: ${validUnits.join(", ")}.`,
      });
    }

    // Validate expiry date
    const expiry = new Date(finalExpiryTime);

    if (
      Number.isNaN(expiry.getTime()) ||
      expiry <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Expiry time must be a valid future date.",
      });
    }

    // Validate preparation date if provided
    let preparationDate;

    if (preparedAt) {
      preparationDate = new Date(preparedAt);

      if (
        Number.isNaN(preparationDate.getTime()) ||
        preparationDate > expiry
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Preparation time must be valid and cannot be after expiry time.",
        });
      }
    }

    // Authentication middleware sets req.user.id
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in again to create a donation.",
      });
    }

    // Create donation
    const donation = await Donation.create({
      foodName: finalFoodName.trim(),
      description: description.trim(),
      quantity: numericQuantity,
      unit,
      foodType,
      preparedAt: preparationDate,
      expiryTime: expiry,
      pickupAddress: pickupAddress.trim(),
      contactPhone,
      status: "available",
      donor: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Donation created successfully.",
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    // Return validation errors clearly during development
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid donation data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create donation.",
    });
  }
};

// ========================================
// 2. GET ALL AVAILABLE DONATIONS
// GET /api/donations
// ========================================
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      status: "available",
      expiryTime: { $gt: new Date() },
    })
      .populate("donor", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donations.",
    });
  }
};

// ========================================
// 3. GET DONATIONS OF LOGGED-IN DONOR
// GET /api/donations/my
// ========================================
exports.getMyDonations = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your donations.",
      });
    }

    const donations = await Donation.find({
      donor: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get my donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your donations.",
    });
  }
};

// ========================================
// 4. DELETE A DONATION
// DELETE /api/donations/:id
// ========================================
exports.deleteDonation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to delete a donation.",
      });
    }

    const { id } = req.params;

    const donation = await Donation.findOne({
      _id: id,
      donor: req.user.id,
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found or you do not own it.",
      });
    }

    // Only available or expired donations can be deleted
    if (
      donation.status !== "available" &&
      donation.status !== "expired"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only available or expired donations can be deleted.",
      });
    }

    await donation.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Donation deleted successfully.",
      donationId: id,
    });
  } catch (error) {
    console.error("Delete donation error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete donation.",
    });
  }
};

