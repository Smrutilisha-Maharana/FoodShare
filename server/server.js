require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
console.error("MongoDB connection error: MONGODB_URI is missing from .env");
process.exit(1);
}

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
console.log("MongoDB connected successfully");


app.listen(PORT, () => {
  console.log(`FoodShare server running on port ${PORT}`);
});


})
.catch((error) => {
console.error("MongoDB connection error:", error.message);
process.exit(1);
});
