
const express = require("express");
const router = express.Router();

// Import donation controller functions
const {
  createDonation,
  getDonations,
  getMyDonations,
  deleteDonation,
} = require("../controllers/donationController");

// Import authentication middleware
const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

// ========================================
// GET ALL AVAILABLE DONATIONS
// GET /api/donations
// ========================================
router.get("/", getDonations);

// ========================================
// GET DONATIONS OF LOGGED-IN DONOR
// GET /api/donations/my
// ========================================
router.get(
  "/my",
  protect,
  allowRoles("donor"),
  getMyDonations
);

// ========================================
// CREATE A NEW DONATION
// POST /api/donations
// ========================================
router.post(
  "/",
  protect,
  allowRoles("donor"),
  createDonation
);

// ========================================
// DELETE A DONATION
// DELETE /api/donations/:id
// ========================================
router.delete(
  "/:id",
  protect,
  allowRoles("donor"),
  deleteDonation
);

module.exports = router;

