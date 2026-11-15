
const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getAllNGOs,
  verifyNGO,
  getUsersForVerification,
  verifyUser,
} = require("../controllers/adminController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

// Only authenticated admins can access these routes.
router.get(
  "/dashboard",
  protect,
  allowRoles("admin"),
  getAdminDashboard
);

router.get(
  "/ngos",
  protect,
  allowRoles("admin"),
  getAllNGOs
);

router.get(
  "/users/verification",
  protect,
  allowRoles("admin"),
  getUsersForVerification
);

router.patch(
  "/ngos/:id/verify",
  protect,
  allowRoles("admin"),
  verifyNGO
);

router.patch(
  "/users/:id/verification",
  protect,
  allowRoles("admin"),
  verifyUser
);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin routes are working!",
  });
});

module.exports = router;

