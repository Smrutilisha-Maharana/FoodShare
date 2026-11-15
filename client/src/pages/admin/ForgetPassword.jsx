import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send the reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10 sm:p-10">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <LockKeyhole size={30} />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
          FoodShare Admin
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Forgot password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Enter your registered admin email. We'll send you a secure link
          to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Admin email address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
              <Mail size={19} className="text-emerald-600" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@foodshare.com"
                autoComplete="email"
                required
                className="w-full bg-transparent py-3.5 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <Link
          to="/admin/login"
          className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Admin Login
        </Link>
      </div>
    </div>
  );
}