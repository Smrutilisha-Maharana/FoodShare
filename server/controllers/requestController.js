const mongoose = require("mongoose");
const DonationRequest = require("../models/DonationRequest");
const Donation = require("../models/Donation");

// NGO creates a pickup request
const createRequest = async (req, res) => {
try {
if (req.user.role !== "ngo") {
return res.status(403).json({
success: false,
message: "Only NGOs can request donations",
});
}


const { donationId, message } = req.body;
const ngoId = req.user.id;

if (!donationId || !mongoose.Types.ObjectId.isValid(donationId)) {
  return res.status(400).json({
    success: false,
    message: "Valid donation ID is required",
  });
}

const donation = await Donation.findById(donationId);

if (!donation) {
  return res.status(404).json({
    success: false,
    message: "Donation not found",
  });
}

if (donation.status !== "available") {
  return res.status(400).json({
    success: false,
    message: "This donation is no longer available",
  });
}

const existingRequest = await DonationRequest.findOne({
  donation: donationId,
  ngo: ngoId,
});

if (existingRequest) {
  return res.status(409).json({
    success: false,
    message: "You have already requested this donation",
  });
}

const request = await DonationRequest.create({
  donation: donationId,
  ngo: ngoId,
  message: message || "",
  status: "pending",
});

donation.status = "requested";
donation.requestedBy = ngoId;
await donation.save();

return res.status(201).json({
  success: true,
  message: "Pickup request created successfully",
  request,
});


} catch (error) {
console.error("Create request error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to create pickup request",
  error: error.message,
});


}
};

// NGO views requests they created
const getMyRequests = async (req, res) => {
try {
if (req.user.role !== "ngo") {
return res.status(403).json({
success: false,
message: "Only NGOs can view their pickup requests",
});
}


const requests = await DonationRequest.find({
  ngo: req.user.id,
})
  .populate("donation")
  .populate("ngo", "name email organizationName")
  .sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  count: requests.length,
  requests,
});


} catch (error) {
console.error("Get NGO requests error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch pickup requests",
  error: error.message,
});


}
};

// Donor views requests received for their donations
const getDonorRequests = async (req, res) => {
try {
if (req.user.role !== "donor") {
return res.status(403).json({
success: false,
message: "Only donors can view received pickup requests",
});
}


const donorId = req.user.id;

const donorDonations = await Donation.find({
  donor: donorId,
}).select("_id");

const donationIds = donorDonations.map((donation) => donation._id);

const requests = await DonationRequest.find({
  donation: { $in: donationIds },
})
  .populate("donation")
  .populate("ngo", "name email organizationName")
  .sort({ createdAt: -1 });

return res.status(200).json({
  success: true,
  count: requests.length,
  requests,
});


} catch (error) {
console.error("Get donor requests error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch donor pickup requests",
  error: error.message,
});


}
};

// Update pickup request status
const updateRequestStatus = async (req, res) => {
try {
const { status } = req.body;
const userId = req.user.id;
const userRole = req.user.role;


if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid pickup request ID",
  });
}

const request = await DonationRequest.findById(req.params.id);

if (!request) {
  return res.status(404).json({
    success: false,
    message: "Pickup request not found",
  });
}

// Donor can approve or reject requests for their own donations.
if (userRole === "donor") {
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Donors can only approve or reject requests",
    });
  }

  const donation = await Donation.findById(request.donation);

  if (!donation || donation.donor.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot update requests for another donor's donation",
    });
  }

  if (request.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Only pending requests can be approved or rejected",
    });
  }

  request.status = status;
  await request.save();

  // Update donation status according to donor decision.
  if (status === "approved") {
    donation.status = "requested";
    donation.requestedBy = request.ngo;
  } else {
    donation.status = "available";
    donation.requestedBy = null;
  }

  await donation.save();
} else if (userRole === "ngo") {
  if (status !== "collected") {
    return res.status(400).json({
      success: false,
      message: "NGOs can only mark approved requests as collected",
    });
  }

  if (request.ngo.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot update another NGO's request",
    });
  }

  if (request.status !== "approved") {
    return res.status(400).json({
      success: false,
      message: "Only approved requests can be marked as collected",
    });
  }

  request.status = "collected";
  await request.save();

  await Donation.findByIdAndUpdate(request.donation, {
    status: "collected",
  });
} else {
  return res.status(403).json({
    success: false,
    message: "You are not allowed to update pickup requests",
  });
}

const updatedRequest = await DonationRequest.findById(request._id)
  .populate("donation")
  .populate("ngo", "name email organizationName");

return res.status(200).json({
  success: true,
  message: "Pickup request status updated successfully",
  request: updatedRequest,
});


} catch (error) {
console.error("Update request error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to update request status",
  error: error.message,
});


}
};

module.exports = {
createRequest,
getMyRequests,
getDonorRequests,
updateRequestStatus,
};
