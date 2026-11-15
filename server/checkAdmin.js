require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = (
      process.env.ADMIN_INITIAL_EMAIL || "adminfoodshare@gmail.com"
    ).trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("Admin account not found.");
      return;
    }

    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Password matches .env:",
      await bcrypt.compare(
        process.env.ADMIN_INITIAL_PASSWORD,
        user.password
      )
    );
  } catch (error) {
    console.error("Check failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();