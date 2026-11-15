
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const ngoRoutes = require("./routes/ngoRoutes");

const app = express();

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Correct FoodShare app.js is running",
  });
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", passwordResetRoutes);
app.use("/api/ngos", ngoRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FoodShare API is running.",
  });
});

module.exports = app;

