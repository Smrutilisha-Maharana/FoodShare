import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Truck,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  CalendarClock,
  ArrowUpRight,
  Search,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";
import NGOSidebar from "../../components/ngo/NGOSidebar";

const filters = [
  { label: "All requests", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Collected", value: "collected" },
  { label: "Rejected", value: "rejected" },
];

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  requested: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  approved: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  collected: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

function getItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getStatus(request) {
  return String(request?.status || "pending").toLowerCase();
}

function getDonation(request) {
  return request?.donation || request?.donationId || {};
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statCards = [
  {
    title: "Total requests",
    description: "All pickup requests",
    icon: Package,
    gradient: "from-emerald-500 to-teal-600",
    value: "total",
  },
  {
    title: "Pending",
    description: "Awaiting a decision",
    icon: Clock3,
    gradient: "from-amber-400 to-orange-500",
    value: "pending",
  },
  {
    title: "Approved",
    description: "Ready to coordinate",
    icon: Truck,
    gradient: "from-blue-500 to-indigo-600",
    value: "approved",
  },
  {
    title: "Collected",
    description: "Completed pickups",
    icon: CheckCircle2,
    gradient: "from-violet-500 to-fuchsia-600",
    value: "collected",
  },
];

export default function PickupRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get("/requests/my");
      const fetchedRequests = getItems(response.data);

      setRequests(fetchedRequests);
    } catch (error) {
      console.error(
        "Fetch pickup requests error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load pickup requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  const handleMarkCollected = async (requestId) => {
  try {
    await api.patch(`/requests/${requestId}/status`, {
      status: "collected",
    });

    toast.success("Food marked as collected successfully!");

    await fetchRequests(true);
  } catch (error) {
    console.error(
      "Mark collected error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
        "Unable to mark food as collected."
    );
  }
};
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const status = getStatus(request);
      const donation = getDonation(request);

      const matchesFilter =
        activeFilter === "all" || status === activeFilter;

      const searchableText = [
        donation?.foodName,
        donation?.title,
        donation?.pickupAddress,
        donation?.foodType,
        request?.pickupAddress,
        request?.message,
        request?.notes,
        request?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.trim().toLowerCase()
      );

      return matchesFilter && matchesSearch;
    });
  }, [requests, activeFilter, search]);

  const pendingCount = requests.filter((request) =>
    ["pending", "requested"].includes(getStatus(request))
  ).length;

  const approvedCount = requests.filter(
    (request) => getStatus(request) === "approved"
  ).length;

  const collectedCount = requests.filter((request) =>
    ["collected", "completed"].includes(getStatus(request))
  ).length;

  const rejectedCount = requests.filter(
    (request) => getStatus(request) === "rejected"
  ).length;

  const statValues = {
    total: requests.length,
    pending: pendingCount,
    approved: approvedCount,
    collected: collectedCount,
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
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Collection management
              </p>

              <h1 className="text-lg font-black text-white">
                Pickup Requests
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchRequests(true)}
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

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold">
                  <Truck size={15} />
                  PICKUP CONTROL CENTER
                </span>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Every pickup brings hope.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100">
                  Follow your requests from submission to collection and keep
                  every food rescue organised.
                </p>
              </div>

              <Link
                to="/ngo/browse-donations"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Browse food
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.value}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-[#101815] p-5 shadow-lg shadow-black/10 transition hover:border-emerald-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-400">
                        {card.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-black text-white">
                        {loading ? "—" : statValues[card.value]}
                      </h3>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </section>

          {/* REQUEST HISTORY */}
          <section className="rounded-[2rem] border border-white/10 bg-[#101815] p-5 shadow-xl shadow-black/10 sm:p-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-black text-white">
                  Your pickup history
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredRequests.length} request
                  {filteredRequests.length === 1 ? "" : "s"} shown
                </p>
              </div>

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search food or pickup location..."
                  className="w-full rounded-2xl border border-white/10 bg-[#090e0c] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* FILTERS */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    activeFilter === filter.value
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30"
                      : "border border-white/10 bg-[#090e0c] text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-52 animate-pulse rounded-3xl border border-white/5 bg-[#090e0c]"
                  />
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              /* EMPTY STATE */
              <div className="py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400">
                  <Truck size={35} />
                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  No pickup requests found
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {search || activeFilter !== "all"
                    ? "Try changing your search or filter."
                    : "Your submitted pickup requests will appear here."}
                </p>

                <Link
                  to="/ngo/browse-donations"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
                >
                  Browse donations
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            ) : (
              /* REQUEST CARDS */
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {filteredRequests.map((request, index) => {
                  const donation = getDonation(request);
                  const status = getStatus(request);

                  const id =
                    request._id || request.id || `request-${index}`;

                  return (
                    <motion.article
                      key={id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.04, 0.3),
                      }}
                      className="rounded-3xl border border-white/10 bg-[#0b110e] p-5 transition hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-950/10"
                    >
                      {/* FOOD AND STATUS */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                            <Package size={22} />
                          </div>

                          <div>
                            <h3 className="font-bold text-white">
                              {donation?.foodName ||
                                donation?.title ||
                                "Food donation"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                              {donation?.quantity ?? "—"}{" "}
                              {donation?.unit || "items"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${
                            statusStyles[status] ||
                            "bg-slate-500/10 text-slate-400 ring-white/10"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* REQUEST DETAILS */}
                      <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm text-slate-300">
                        <div className="flex items-start gap-3">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />

                          <span>
                            {donation?.pickupAddress ||
                              request?.pickupAddress ||
                              "Pickup location not specified"}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarClock
                            size={17}
                            className="mt-0.5 shrink-0 text-emerald-400"
                          />

                          <span>
                            <strong className="text-slate-200">
                              Requested:
                            </strong>{" "}
                            {formatDate(
                              request?.createdAt || request?.requestDate
                            )}
                          </span>
                        </div>

                        {request?.message && (
                          <div className="flex items-start gap-3">
                            <MessageSquare
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span>{request.message}</span>
                          </div>
                        )}
                      </div>

                      {/* APPROVED */}
                      {status === "approved" && (
                        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs leading-5 text-blue-300">
                          <Truck size={16} className="mt-0.5 shrink-0" />

                          Your request is approved. Coordinate the collection
                          with the donor using your application's supported
                          contact details.
                        </div>
                      )}
                      {status === "approved" && (
  <button
    type="button"
    onClick={() => handleMarkCollected(id)}
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
  >
    <CheckCircle2 size={18} />
    Mark as Collected
  </button>
)}

                      {/* COLLECTED */}
                      {["collected", "completed"].includes(status) && (
                        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 size={16} />
                          This pickup has been completed.
                        </div>
                      )}

                      {/* REJECTED */}
                      {status === "rejected" && (
                        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
                          <XCircle size={16} />
                          This request was rejected.
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* FOOTER SUMMARY */}
            {!loading && requests.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">
                Total: {requests.length} · Pending: {pendingCount} ·
                Approved: {approvedCount} · Collected: {collectedCount} ·
                Rejected: {rejectedCount}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}