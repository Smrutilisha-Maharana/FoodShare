const User = require("../models/User");

// ADMIN: Get all users
exports.getUsers = async (req, res) => {
try {
const users = await User.find()
.select("-password")
.sort({ createdAt: -1 })
.lean();


return res.status(200).json({
  success: true,
  count: users.length,
  users,
});


} catch (error) {
console.error("Get users error:", error);


return res.status(500).json({
  success: false,
  message: "Failed to fetch users.",
});


}
};

// ADMIN: Change a user's role
exports.updateUserRole = async (req, res) => {
try {
const { id } = req.params;
const { role } = req.body;


const allowedRoles = ["donor", "ngo", "admin"];

if (!allowedRoles.includes(role)) {
  return res.status(400).json({
    success: false,
    message: "Invalid user role.",
  });
}

if (String(req.user._id) === String(id)) {
  return res.status(400).json({
    success: false,
    message: "You cannot change your own role.",
  });
}

const user = await User.findById(id);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

user.role = role;
await user.save();

const safeUser = await User.findById(user._id)
  .select("-password")
  .lean();

return res.status(200).json({
  success: true,
  message: "User role updated successfully.",
  user: safeUser,
});


} catch (error) {
console.error("Update user role error:", error);


if (error.name === "CastError") {
  return res.status(400).json({
    success: false,
    message: "Invalid user ID.",
  });
}

return res.status(500).json({
  success: false,
  message: "Failed to update user role.",
});


}
};

// ADMIN: Delete a user
exports.deleteUser = async (req, res) => {
try {
const { id } = req.params;


if (String(req.user._id) === String(id)) {
  return res.status(400).json({
    success: false,
    message: "You cannot delete your own account here.",
  });
}

const user = await User.findById(id);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

// Prevent deleting another administrator through this endpoint.
if (user.role === "admin") {
  return res.status(403).json({
    success: false,
    message: "Administrator accounts cannot be deleted here.",
  });
}

await user.deleteOne();

return res.status(200).json({
  success: true,
  message: "User deleted successfully.",
  userId: id,
});


} catch (error) {
console.error("Delete user error:", error);


if (error.name === "CastError") {
  return res.status(400).json({
    success: false,
    message: "Invalid user ID.",
  });
}

return res.status(500).json({
  success: false,
  message: "Failed to delete user.",
});


}
};
