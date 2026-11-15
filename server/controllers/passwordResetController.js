const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Create Gmail transporter
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

// STEP 1: Request password reset
exports.forgotPassword = async (req, res) => {
let user = null;
let tokenGenerated = false;

try {
const email = req.body.email?.trim().toLowerCase();

// Validate email
if (!email) {
  return res.status(400).json({
    success: false,
    message: "Please enter your email address.",
  });
}

// Check email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "Email configuration missing. Check EMAIL_USER and EMAIL_PASS in .env."
  );

  return res.status(500).json({
    success: false,
    message: "Email service is not configured. Please contact the administrator.",
  });
}

// Find admin account
user = await User.findOne({
  email,
  role: "admin",
});

console.log("Forgot password request received.");
console.log("Matching admin found:", Boolean(user));

// Use a generic response to avoid revealing account existence.
const message =
  "If an admin account exists for this email, a reset link will be sent.";

if (!user) {
  return res.status(200).json({
    success: true,
    message,
  });
}

// Check frontend URL
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL is missing from .env.");
}

// Generate a cryptographically secure token
const resetToken = crypto.randomBytes(32).toString("hex");

// Store only the hash of the token
user.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

// Token expires after 15 minutes
user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

await user.save();
tokenGenerated = true;

// Construct reset link
const resetLink =
  `${frontendUrl.replace(/\/+$/, "")}/admin/reset-password/${resetToken}`;

console.log("Attempting to send password reset email.");

// Send reset email
const emailResult = await transporter.sendMail({
  from: {
    name: "FoodShare",
    address: process.env.EMAIL_USER,
  },
  to: user.email,
  subject: "FoodShare Admin Password Reset",
  text: [
    "A password reset was requested for your FoodShare admin account.",
    "",
    "Use the link below to reset your password:",
    resetLink,
    "",
    "This link expires in 15 minutes.",
    "If you did not request this reset, you can ignore this email.",
  ].join("\n"),
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; color: #333;">
      <h2 style="color: #16865c;">FoodShare Password Reset</h2>
      <p>A password reset was requested for your administrator account.</p>
      <p>Click the button below to choose a new password:</p>
      <p style="margin: 28px 0;">
        <a
          href="${resetLink}"
          style="background: #16865c; color: white; padding: 12px 22px; text-decoration: none; border-radius: 6px; display: inline-block;"
        >
          Reset Password
        </a>
      </p>
      <p>If the button doesn't work, copy this link into your browser:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p><strong>This link expires in 15 minutes.</strong></p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    </div>
  `,
});

console.log("Password reset email accepted by mail server.");
console.log("Email message ID:", emailResult.messageId);

return res.status(200).json({
  success: true,
  message,
});


} catch (error) {
console.error("Forgot password error:", error.message);

// Invalidate the reset token if email delivery fails.
if (user && tokenGenerated) {
  try {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  } catch (cleanupError) {
    console.error(
      "Reset token cleanup failed:",
      cleanupError.message
    );
  }
}

return res.status(500).json({
  success: false,
  message: "Unable to send the reset email. Please try again later.",
});


}
};

// STEP 2: Reset password using the emailed token
exports.resetPassword = async (req, res) => {
try {
const { token } = req.params;
const { password } = req.body;


// Validate input
if (!token || !password) {
  return res.status(400).json({
    success: false,
    message: "Reset token and new password are required.",
  });
}

if (typeof password !== "string" || password.length < 12) {
  return res.status(400).json({
    success: false,
    message: "Your new password must be at least 12 characters long.",
  });
}

// Hash the token to compare with the database value
const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

// Find admin with a valid, unexpired token
const user = await User.findOne({
  role: "admin",
  resetPasswordToken: hashedToken,
  resetPasswordExpires: { $gt: new Date() },
}).select("+password");

if (!user) {
  return res.status(400).json({
    success: false,
    message: "This reset link is invalid or has expired. Please request a new one.",
  });
}

// Hash and update password
user.password = await bcrypt.hash(password, 12);

// Invalidate token after successful reset
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;

await user.save();

console.log("Admin password reset successfully.");

return res.status(200).json({
  success: true,
  message: "Password reset successfully. You can now log in.",
});


} catch (error) {
console.error("Reset password error:", error.message);

return res.status(500).json({
  success: false,
  message: "Unable to reset your password right now. Please try again later.",
});


}
};
