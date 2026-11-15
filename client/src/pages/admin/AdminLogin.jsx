
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "adminfoodshare@gmail.com",
    password: "Smrutilisha94372",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }

      // Do not trim or otherwise modify the password.
      const loggedInUser = await login(email, password, true);

      if (loggedInUser?.role !== "admin") {
        setError("Access denied. Administrators only.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login failed:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Login card */}
        <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl shadow-green-900/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <ShieldCheck size={34} />
            </div>

            <h1 className="text-2xl font-bold">FoodShare Admin</h1>

            <p className="mt-2 text-sm text-green-50">
              Sign in to manage the FoodShare platform
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter admin email"
                    autoComplete="username"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your admin password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-green-700 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3.5 font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Sign In as Admin
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <p className="text-xs leading-5 text-gray-500">
                This login is restricted to authorized administrators.
                Unauthorized access is not permitted.
              </p>

              <Link
                to="/login"
                className="mt-4 inline-block text-sm font-semibold text-green-700 transition hover:text-green-900"
              >
                User login instead
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FoodShare. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;

