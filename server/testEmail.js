require("dotenv").config();

const nodemailer = require("nodemailer");

async function testEmail() {
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

try {
await transporter.verify();
console.log("Gmail authentication successful!");
} catch (error) {
console.error("Gmail authentication failed:", error.message);
}
}

testEmail();
