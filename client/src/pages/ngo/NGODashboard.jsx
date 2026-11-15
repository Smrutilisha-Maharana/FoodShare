import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  Truck,
  Package,
  HeartHandshake,
  ArrowUpRight,
  MapPin,
  CalendarClock,
  Leaf,
  RefreshCw,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";
import NGOSidebar from "../../components/ngo/NGOSidebar";

function getItems(data) {
  if (Array.isArray(data)) return data;
  return data?.donations || data?.requests || data?.data || [];
}

function formatDate(date) {
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statCards = [
  {
    title: "Available Donations",
    description: "Food ready for collection",
    icon: Package,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Total Requests",
    description: "Your submitted pickup requests",
    icon: Truck,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Pending Requests",
    description: "Waiting for a decision",
    icon: Clock3,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Completed Pickups",
    description: "Successfully collected",
    icon: CheckCircle2,
    color: "from-violet-500 to-purple-600",
  },
];

export default function NGODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.get("/donations"),
        api.get("/requests/my"),
      ]);

      if (results[0].status === "fulfilled") {
        setDonations(getItems(results[0].value.data));
      } else {
        console.error("Donation loading error:", results[0].reason);
        setDonations([]);
        toast.error("Could not load donations.");
      }

      if (results[1].status === "fulfilled") {
        const requestData = results[1].value.data;

        console.log("NGO dashboard requests:", requestData);

        setRequests(
          Array.isArray(requestData.requests)
            ? requestData.requests
            : getItems(requestData)
        );
      } else {
        console.error(
          "Pickup request loading error:",
          results[1].reason?.response?.data || results[1].reason
        );

        setRequests([]);
        toast.error("Could not load pickup requests.");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const availableDonations = useMemo(
    () =>
      donations.filter(
        (item) =>
          String(item.status || "available").toLowerCase() === "available"
      ),
    [donations]
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter((item) =>
        ["pending", "requested"].includes(
          String(item.status || "pending").toLowerCase()
        )
      ),
    [requests]
  );

  const approvedRequests = useMemo(
    () =>
      requests.filter(
        (item) =>
          String(item.status || "").toLowerCase() === "approved"
      ),
    [requests]
  );

  const completedRequests = useMemo(
    () =>
      requests.filter((item) =>
        ["completed", "collected"].includes(
          String(item.status || "").toLowerCase()
        )
      ),
    [requests]
  );

  const statValues = [
    availableDonations.length,
    requests.length,
    pendingRequests.length,
    completedRequests.length,
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b0a] text-slate-100">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <NGOSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative min-h-screen lg:pl-72">

        {/* Header */}
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
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                NGO Workspace
              </p>

              <h2 className="text-lg font-black text-white">
                Dashboard
              </h2>
            </div>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a16] px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">

          {/* Hero section */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#0f766e] p-7 text-white shadow-2xl shadow-emerald-950/30 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-teal-200/20 blur-3xl" />

            <div className="relative grid gap-8 md:grid-cols-[1.5fr_0.7fr] md:items-center">

              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">
                  <Leaf size={15} />
                  FOOD RESCUE PARTNER
                </span>

                <h1 className="mt-6 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                  Together, we can turn surplus into smiles.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
                  Discover available food donations, organise collections,
                  and help good food reach people who need it.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/ngo/browse-donations"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    <Search size={18} />
                    Browse donations
                    <ArrowUpRight size={17} />
                  </Link>

                  <Link
                    to="/ngo/pickup-requests"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20"
                  >
                    <Truck size={18} />
                    Track pickups
                  </Link>
                </div>
              </div>

              <div className="hidden justify-center md:flex">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/15">
                    <HeartHandshake size={75} strokeWidth={1.4} />
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.section>

          {/* Statistics */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-black text-white">
                Your Impact Overview
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                A quick look at your food rescue activity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {statCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.article
                    key={card.title}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101815] p-5 shadow-lg shadow-black/20 transition hover:border-emerald-500/30 hover:shadow-emerald-950/30"
                  >
                    <div className={`absolute -right-7 -top-7 h-28 w-28 rounded-full bg-gradient-to-br ${card.color} opacity-[0.08] transition-transform duration-500 group-hover:scale-150`} />

                    <div className="relative flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-slate-400">
                          {card.title}
                        </p>

                        <p className="mt-3 text-4xl font-black text-white">
                          {loading ? (
                            <span className="inline-block h-10 w-16 animate-pulse rounded-lg bg-slate-700" />
                          ) : (
                            statValues[index]
                          )}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {card.description}
                        </p>
                      </div>

                      <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white shadow-lg`}>
                        <Icon size={23} />
                      </div>

                    </div>
                  </motion.article>
                );
              })}

            </div>

            {/* Request status overview */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-[#101815] p-5 shadow-lg sm:p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">
                    Request Status Overview
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Track your pickup request progress.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  {requests.length} Total
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-sm font-medium text-blue-400">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-black text-white">
                    {loading ? "—" : pendingRequests.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-sm font-medium text-emerald-400">
                    Approved
                  </p>

                  <p className="mt-2 text-3xl font-black text-white">
                    {loading ? "—" : approvedRequests.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                  <p className="text-sm font-medium text-violet-400">
                    Collected
                  </p>

                  <p className="mt-2 text-3xl font-black text-white">
                    {loading ? "—" : completedRequests.length}
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Recent donations */}
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101815] p-5 shadow-xl shadow-black/20 sm:p-7">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-xl font-black text-white">
                  Recently Available Donations
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Explore food that may be ready for collection.
                </p>
              </div>

              <Link
                to="/ngo/browse-donations"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
              >
                View all <ArrowUpRight size={17} />
              </Link>

            </div>

            {loading ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl bg-slate-800/70"
                  />
                ))}
              </div>
            ) : availableDonations.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/5 bg-[#0b110e] p-8 text-center">

                <Package
                  size={35}
                  className="mx-auto text-emerald-400"
                />

                <h3 className="mt-3 font-bold text-white">
                  No Available Donations Right Now
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Refresh later to check for new food donations.
                </p>

              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {availableDonations.slice(0, 3).map((donation) => (
                  <article
                    key={donation._id || donation.id}
                    className="rounded-2xl border border-white/10 bg-[#0b110e] p-5 transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                        <Package size={21} />
                      </div>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                        Available
                      </span>

                    </div>

                    <h3 className="mt-4 font-bold text-white">
                      {donation.foodName ||
                        donation.title ||
                        "Food donation"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {donation.quantity ?? "—"}{" "}
                      {donation.unit || "items"} ·{" "}
                      {donation.foodType || "Food"}
                    </p>

                    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-400">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                      {donation.pickupAddress || "Pickup address not provided"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Expires: {formatDate(donation.expiryTime)}
                    </p>

                    <Link
                      to="/ngo/browse-donations"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition hover:gap-3 hover:text-emerald-300"
                    >
                      View donation <ArrowUpRight size={16} />
                    </Link>

                  </article>
                ))}

              </div>
            )}

          </section>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">

            <span className="inline-flex items-center gap-2">
              <Leaf size={14} className="text-emerald-400" />
              Every donation makes a difference.
            </span>

            <span className="inline-flex items-center gap-2">
              <HeartHandshake size={14} className="text-emerald-400" />
              Together toward zero food waste.
            </span>

          </footer>

        </div>
      </main>
    </div>
  );
}