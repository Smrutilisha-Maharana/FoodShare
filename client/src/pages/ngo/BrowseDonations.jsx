import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  MapPin,
  CalendarClock,
  Package,
  ArrowLeft,
  RefreshCw,
  Truck,
  Leaf,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";
import NGOSidebar from "../../components/ngo/NGOSidebar";

const categories = [
  "All categories",
  "Prepared Food",
  "Fruits & Vegetables",
  "Bakery Items",
  "Packaged Food",
  "Dairy Products",
  "Other",
];

function getItems(data) {
  if (Array.isArray(data)) return data;
  return data?.donations || data?.data || [];
}

function formatDate(date) {
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return "Not specified";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BrowseDonations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [requestingId, setRequestingId] = useState(null);

  const fetchDonations = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.get("/donations");
      const items = getItems(response.data);

      setDonations(
        items.filter(
          (item) =>
            String(item.status || "available").toLowerCase() === "available"
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not load donations."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const filteredDonations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return donations.filter((donation) => {
      const type = donation.foodType || donation.category || "Other";

      const matchesCategory =
        category === "All categories" || type === category;

      const searchableText = [
        donation.foodName,
        donation.title,
        donation.description,
        type,
        donation.pickupAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const expiry = new Date(
        donation.expiryTime || donation.expiryDate || ""
      );

      const notExpired =
        !Number.isNaN(expiry.getTime()) && expiry > new Date();

      return matchesCategory && searchableText.includes(query) && notExpired;
    });
  }, [donations, search, category]);

  const requestPickup = async (donation) => {
    const donationId = donation._id || donation.id;

    if (!donationId) {
      toast.error("Invalid donation ID.");
      return;
    }

    const confirmed = window.confirm(
      `Would you like to request pickup for "${
        donation.foodName || donation.title || "this donation"
      }"?`
    );

    if (!confirmed) return;

    setRequestingId(donationId);

    try {
      const response = await api.post("/requests", {
        donationId,
        message: "I would like to collect this food donation.",
      });

      console.log("Backend response:", response.data);

      toast.success("Pickup request submitted successfully!");
      await fetchDonations(true);
    } catch (error) {
      console.error("Pickup request error:", error);
      console.error("Backend error:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit pickup request."
      );
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0a] text-slate-100">
      <NGOSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen lg:pl-72">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#090e0c]/90 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Discover food
              </p>

              <h1 className="text-lg font-black text-white">
                Browse Donations
              </h1>
            </div>
          </div>

          <button
            onClick={() => fetchDonations(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101815] px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-400 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#042f2e] p-7 text-white shadow-xl shadow-emerald-950/20 sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold">
                <Leaf size={15} />
                FOOD RESCUE MARKETPLACE
              </span>

              <h2 className="mt-5 max-w-2xl text-3xl font-black sm:text-4xl">
                Good food deserves a second chance.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100">
                Discover available donations, connect with food donors, and
                coordinate collections for your community.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold">
                <Package size={18} />
                {loading
                  ? "Loading donations..."
                  : `${filteredDonations.length} donations found`}
              </div>
            </div>
          </section>

          {/* SEARCH AND FILTER */}
          <section className="rounded-3xl border border-white/10 bg-[#101815] p-4 shadow-xl shadow-black/10 sm:p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_260px]">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search food, description, or location..."
                  className="w-full rounded-2xl border border-white/10 bg-[#090e0c] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#090e0c] py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-[#101815]">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* LOADING */}
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-3xl border border-white/5 bg-[#101815]"
                />
              ))}
            </div>
          ) : filteredDonations.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-[2rem] border border-white/10 bg-[#101815] px-6 py-16 text-center shadow-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400">
                <Search size={34} />
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                No donations found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try another search or category, or refresh to check for new
                donations.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All categories");
                  fetchDonations(true);
                }}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                Reset filters
              </button>
            </div>
          ) : (
            /* DONATION CARDS */
            <motion.section
              layout
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredDonations.map((donation, index) => {
                const id = donation._id || donation.id;
                const expiry = donation.expiryTime || donation.expiryDate;

                return (
                  <motion.article
                    key={id || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    whileHover={{ y: -5 }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-[#101815] shadow-lg shadow-black/10 transition hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                          <Package size={23} />
                        </div>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          Available
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-black text-white">
                        {donation.foodName || donation.title || "Food donation"}
                      </h3>

                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        {donation.foodType || "Other"}
                      </p>

                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-400">
                        {donation.description || "No description provided."}
                      </p>

                      <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm text-slate-300">
                        <div className="flex items-center gap-3">
                          <Package
                            size={17}
                            className="shrink-0 text-emerald-400"
                          />
                          <span>
                            <strong className="text-slate-200">Quantity:</strong>{" "}
                            {donation.quantity ?? "—"}{" "}
                            {donation.unit || "items"}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />
                          <span className="break-words">
                            {donation.pickupAddress || "Address not provided"}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarClock
                            size={17}
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />
                          <span>
                            <strong className="text-slate-200">Expires:</strong>{" "}
                            {formatDate(expiry)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => requestPickup(donation)}
                        disabled={requestingId === id}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Truck size={18} />
                        {requestingId === id ? "Submitting..." : "Request Pickup"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.section>
          )}

          {/* BACK BUTTON */}
          <div className="text-center">
            <Link
              to="/ngo/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
            >
              <ArrowLeft size={17} />
              Back to NGO dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}