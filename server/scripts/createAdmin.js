
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    const adminEmail = (
      process.env.ADMIN_INITIAL_EMAIL || "adminfoodshare@gmail.com"
    )
      .trim()
      .toLowerCase();

    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    if (!adminPassword) {
      throw new Error("ADMIN_INITIAL_PASSWORD is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const existingUser = await User.findOne({
      email: adminEmail,
    });

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      existingUser.name = "FoodShare Admin";
      existingUser.isVerified = true;
      existingUser.verificationStatus = "verified";

      await existingUser.save();

      console.log("Existing account updated as admin.");
    } else {
      await User.create({
        name: "FoodShare Admin",
        email: adminEmail,
        phone: "9437257247",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        verificationStatus: "verified",
      });

      console.log("New admin account created successfully.");
    }

    console.log("Admin email:", adminEmail);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
