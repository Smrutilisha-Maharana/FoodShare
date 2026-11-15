const express = require("express");
const router = express.Router();

const {
getNGOs,
updateNGOVerification,
} = require("../controllers/ngoController");

const {
protect,
allowRoles,
} = require("../middleware/authMiddleware");

router.use(protect, allowRoles("admin"));

router.get("/", getNGOs);
router.patch("/:id/verification", updateNGOVerification);

module.exports = router;
