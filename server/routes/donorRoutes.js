const express = require("express");

const router = express.Router();

const {
  getDonorDashboard,
} = require("../controllers/donorController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  protect,
  allowRoles("donor"),
  getDonorDashboard
);

module.exports = router;