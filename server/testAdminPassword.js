
require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function testAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = (
      process.env.ADMIN_INITIAL_EMAIL || "adminfoodshare@gmail.com"
    ).trim().toLowerCase();

    const envPassword = process.env.ADMIN_INITIAL_PASSWORD;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("Admin account not found.");
      return;
    }

    console.log(
      "ENV password matches database:",
      await bcrypt.compare(envPassword, user.password)
    );

    console.log("Stored password hash starts with bcrypt:", /^\$2[aby]\$/.test(user.password));
    console.log("Password length in ENV:", envPassword.length);

  } catch (error) {
    console.error("Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testAdminPassword();

