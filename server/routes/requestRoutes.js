const express = require("express");
const router = express.Router();

const {
createRequest,
getMyRequests,
getDonorRequests,
updateRequestStatus,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

// NGO creates a pickup request
router.post("/", protect, createRequest);

// NGO views requests they created
router.get("/my", protect, getMyRequests);

// Donor views requests received for their donations
router.get("/donor", protect, getDonorRequests);

// NGO or donor updates request status according to permissions
router.patch("/:id/status", protect, updateRequestStatus);

module.exports = router;
