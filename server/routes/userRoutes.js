const express = require("express");

const router = express.Router();

const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

// All user-management routes require administrator access.
router.use(protect, allowRoles("admin"));

router.get("/", getUsers);

router.patch("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

module.exports = router;