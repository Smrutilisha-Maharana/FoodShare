
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
// Main pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Donor pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddDonation from "./pages/donor/AddDonation";
import ManageDonations from "./pages/donor/ManageDonations";
import DonorPickupRequests from "./pages/donor/DonorPickupRequests";

// NGO pages
import NGODashboard from "./pages/ngo/NGODashboard";
import BrowseDonations from "./pages/ngo/BrowseDonations";
import PickupRequests from "./pages/ngo/PickupRequests";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import VerifyNGOs from "./pages/admin/VerifyNGOs";
import AdminLogin from "./pages/admin/AdminLogin";
import ForgetPassword from "./pages/admin/ForgetPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import VerifyUsers from "./pages/admin/VerifyUsers";

function App() {
  // Load saved theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply theme to the entire application
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Toggle dark/light mode
  const handleToggleTheme = () => {
    setIsDarkMode((previousMode) => !previousMode);
  };

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={
          <Home
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================= PUBLIC ADMIN AUTH ROUTES ================= */}

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Forgot password - no login required */}
      <Route
        path="/admin/forget-password"
        element={<ForgetPassword />}
      />

      {/* Reset password - opened through the email reset link */}
      <Route
        path="/admin/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* ================= PROTECTED DONOR ROUTES ================= */}

      <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
        <Route
          path="/donor/dashboard"
          element={<DonorDashboard />}
        />

        <Route
          path="/donor/add-donation"
          element={<AddDonation />}
        />

        <Route
          path="/donor/manage-donations"
          element={<ManageDonations />}
        />
        <Route
  path="/donor/pickup-requests"
  element={<DonorPickupRequests />}
/>
      </Route>

      {/* ================= PROTECTED NGO ROUTES ================= */}

      <Route element={<ProtectedRoute allowedRoles={["ngo"]} />}>
        <Route
          path="/ngo/dashboard"
          element={<NGODashboard />}
        />

        <Route
          path="/ngo/browse-donations"
          element={<BrowseDonations />}
        />

        <Route
          path="/ngo/pickup-requests"
          element={<PickupRequests />}
        />
      </Route>

     {/* ================= PROTECTED ADMIN ROUTES ================= */}

<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />

    <Route path="dashboard" element={<AdminDashboard />} />

    <Route path="manage-users" element={<ManageUsers />} />

    <Route path="verify-users" element={<VerifyUsers />} />

    <Route path="verify-ngos" element={<VerifyNGOs />} />
  </Route>
</Route>
      {/* ================= UNKNOWN ROUTES ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

