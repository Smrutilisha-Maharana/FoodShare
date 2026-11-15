import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

// Status styles
const statusStyles = {
  available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  requested: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  collected: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  expired: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

function getStatus(donation) {
  return String(donation.status || "available").toLowerCase();
}

function getDonationId(donation) {
  return donation._id || donation.id;
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch logged-in donor's donations
  const fetchDonations = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // IMPORTANT: Fetch only the logged-in donor's donations
      const response = await api.get("/donations/my");

      console.log("My Donations API Response:", response.data);

      const result = response.data;

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.donations)
        ? result.donations
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.donations)
        ? result.data.donations
        : [];

      setDonations(data);
    } catch (err) {
      console.error(
        "Manage Donations Error:",
        err.response?.data || err
      );

      const message =
        err.response?.data?.message ||
        "Unable to load your donations. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Filter options
  const filters = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Requested", value: "requested" },
    { label: "Collected", value: "collected" },
    { label: "Expired", value: "expired" },
  ];

  // Search and filter donations
  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const status = getStatus(donation);

      const matchesFilter =
        activeFilter === "all" || status === activeFilter;

      const text = [
        donation.title,
        donation.name,
        donation.foodName,
        donation.foodType,
        donation.description,
        donation.pickupAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase().trim()
      );

      return matchesFilter && matchesSearch;
    });
  }, [donations, activeFilter, search]);

  // Dashboard statistics
  const stats = useMemo(() => {
    return [
      {
        label: "Total Donations",
        value: donations.length,
        icon: Package,
        color: "from-emerald-500 to-teal-500",
      },
      {
        label: "Available",
        value: donations.filter(
          (item) => getStatus(item) === "available"
        ).length,
        icon: UtensilsCrossed,
        color: "from-cyan-500 to-blue-500",
      },
      {
        label: "Requested",
        value: donations.filter(
          (item) => getStatus(item) === "requested"
        ).length,
        icon: Clock3,
        color: "from-amber-400 to-orange-500",
      },
      {
        label: "Collected",
        value: donations.filter(
          (item) => getStatus(item) === "collected"
        ).length,
        icon: HeartHandshake,
        color: "from-violet-500 to-fuchsia-500",
      },
    ];
  }, [donations]);

  // Delete donation
  const handleDelete = async (donation) => {
    const id = getDonationId(donation);

    if (!id) {
      toast.error("This donation has no valid ID.");
      return;
    }

    const status = getStatus(donation);

    if (!["available", "expired"].includes(status)) {
      toast.error(
        "Only available or expired donations can be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${donation.foodName || "this donation"}"?`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await api.delete(`/donations/${id}`);

      setDonations((previous) =>
        previous.filter(
          (item) => getDonationId(item) !== id
        )
      );

      toast.success("Donation deleted successfully.");
    } catch (err) {
      console.error(
        "Delete donation error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "Could not delete this donation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b0a] px-4 py-8 text-white md:px-8">

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl"
        />
      </div>

      <main className="relative mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          to="/donor/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-400 transition hover:bg-[#101815] hover:text-emerald-400"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
              Your impact, in one place
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Manage Donations
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Track your food donations, check their status,
              and manage your community contributions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchDonations(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#101815] px-4 py-3 font-semibold text-gray-300 transition hover:border-emerald-500/40 hover:text-emerald-400 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              to="/donor/add-donation"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5"
            >
              <Plus size={19} />
              Add Donation
            </Link>
          </div>
        </motion.header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-[#101815] p-5 shadow-xl shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-black text-white">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3 text-white shadow-lg`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Donations Section */}
        <section className="rounded-[2rem] border border-white/10 bg-[#0d1411] p-4 shadow-xl shadow-black/30 sm:p-7">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">
                Your Food Contributions
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {filteredDonations.length} donation
                {filteredDonations.length === 1 ? "" : "s"} shown
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your donations..."
                className="w-full rounded-2xl border border-white/10 bg-[#070b0a] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-[#18211c] text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid gap-5 pt-7 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-60 animate-pulse rounded-3xl bg-[#18211c]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-rose-400">{error}</p>

              <button
                onClick={() => fetchDonations()}
                className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500"
              >
                Try Again
              </button>
            </div>
          ) : filteredDonations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400">
                <Package size={36} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                No Donations Found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                {search || activeFilter !== "all"
                  ? "Try a different search or status filter."
                  : "Your donation journey starts here. Share your surplus food with your community."}
              </p>

              <Link
                to="/donor/add-donation"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
              >
                <Plus size={18} />
                Create Donation
              </Link>
            </motion.div>
          ) : (
            /* Donation Cards */
            <motion.div layout className="mt-7 grid gap-5 md:grid-cols-2">
              <AnimatePresence>
                {filteredDonations.map((donation, index) => {
                  const status = getStatus(donation);
                  const id = getDonationId(donation);

                  const title =
                    donation.foodName ||
                    donation.title ||
                    donation.name ||
                    "Food Donation";

                  const quantity = donation.quantity;
                  const unit = donation.unit || "items";

                  const address =
                    donation.pickupAddress ||
                    donation.address ||
                    "Address not provided";

                  const expiry =
                    donation.expiryTime ||
                    donation.expiryDate ||
                    donation.expiresAt;

                  return (
                    <motion.article
                      key={id || `${title}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.035 }}
                      whileHover={{ y: -4 }}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-[#101815] shadow-sm transition hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/10"
                    >
                      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                      <div className="p-5 sm:p-6">

                        {/* Title and Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                              <UtensilsCrossed size={22} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="break-words text-lg font-bold text-white">
                                {title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-400">
                                {donation.foodType ||
                                  donation.category ||
                                  "Food Donation"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
                              statusStyles[status] ||
                              "border-white/10 bg-white/5 text-gray-400"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                          {donation.description ||
                            "No description provided."}
                        </p>

                        {/* Details */}
                        <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm text-gray-400">

                          <div className="flex items-start gap-3">
                            <Package
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span>
                              <strong className="text-gray-200">
                                Quantity:
                              </strong>{" "}
                              {quantity ?? "Not specified"} {unit}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span className="break-words">
                              {address}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <CalendarClock
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span>
                              <strong className="text-gray-200">
                                Expiry Date:
                              </strong>{" "}
                              {formatDate(expiry)}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                          <p className="text-xs text-gray-500">
                            {donation.createdAt
                              ? `Added ${formatDate(donation.createdAt)}`
                              : "Community Contribution"}
                          </p>

                          {["collected", "expired"].includes(status) ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                              <CheckCircle2 size={15} />
                              Closed
                            </span>
                          ) : status === "requested" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400">
                              <Clock3 size={15} />
                              Awaiting Approval
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDelete(donation)}
                              disabled={deletingId === id}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 px-3 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              {deletingId === id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}