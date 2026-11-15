const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate authentication token
const generateToken = (user) => {
return jwt.sign(
{
id: user._id,
role: user.role,
},
process.env.JWT_SECRET,
{
expiresIn: "1d",
}
);
};

// Register a new user
exports.register = async (req, res) => {
try {
const { name, email, phone, password, role } = req.body;


if (!name || !email || !phone || !password || !role) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

if (!["donor", "ngo"].includes(role)) {
  return res.status(400).json({
    message: "Invalid user role",
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message: "Password must contain at least 8 characters",
  });
}

const normalizedEmail = email.trim().toLowerCase();

const existingUser = await User.findOne({
  email: normalizedEmail,
});

if (existingUser) {
  return res.status(409).json({
    message: "Email is already registered",
  });
}

const hashedPassword = await bcrypt.hash(password, 12);

const user = await User.create({
  name: name.trim(),
  email: normalizedEmail,
  phone: phone.trim(),
  password: hashedPassword,
  role,
});

const token = generateToken(user);

return res.status(201).json({
  message: "Registration successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  },
});

} catch (error) {
if (error.code === 11000) {
return res.status(409).json({
message: "Email is already registered",
});
}


console.error("Registration error:", error.message);

return res.status(500).json({
  message: "Registration failed",
});


}
};



// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      console.log("Admin login: user not found");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("Login attempt received");
    console.log("Email found:", user.email);
    console.log("Role:", user.role);
    console.log("Password field exists:", Boolean(user.password));

    const isMatch = await bcrypt.compare(password, user.password);

    // Log the result BEFORE checking it.
    console.log("Password matched:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (isAdmin === true && user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Administrators only.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

