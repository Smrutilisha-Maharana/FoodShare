import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Mail,
  Phone,
  AlertCircle,
  Sparkles,
  Leaf,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

const filters = [
  { label: "All NGOs", value: "all", icon: Building2 },
  { label: "Pending", value: "pending", icon: Clock3 },
  { label: "Verified", value: "verified", icon: CheckCircle2 },
  { label: "Rejected", value: "rejected", icon: XCircle },
];

export default function VerifyNGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  const fetchNGOs = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await api.get("/ngos");
      setNgos(response.data.ngos || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to load NGO applications.";

      setError(message);
      toast.error(message);
      console.error("NGO fetching error:", err.response?.data || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  const counts = useMemo(
    () => ({
      all: ngos.length,
      pending: ngos.filter(
        (ngo) =>
          !ngo.isVerified && ngo.verificationStatus !== "rejected"
      ).length,
      verified: ngos.filter((ngo) => ngo.isVerified).length,
      rejected: ngos.filter(
        (ngo) => ngo.verificationStatus === "rejected"
      ).length,
    }),
    [ngos]
  );

  const visibleNGOs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ngos.filter((ngo) => {
      const matchesSearch =
        !query ||
        ngo.name?.toLowerCase().includes(query) ||
        ngo.email?.toLowerCase().includes(query) ||
        ngo.phone?.includes(query);

      let matchesFilter = true;

      if (filter === "pending") {
        matchesFilter =
          !ngo.isVerified && ngo.verificationStatus !== "rejected";
      } else if (filter === "verified") {
        matchesFilter = Boolean(ngo.isVerified);
      } else if (filter === "rejected") {
        matchesFilter = ngo.verificationStatus === "rejected";
      }

      return matchesSearch && matchesFilter;
    });
  }, [ngos, search, filter]);

  const updateVerification = async (ngo, status) => {
    setBusyId(ngo._id);

    try {
      const response = await api.patch(
        `/ngos/${ngo._id}/verification`,
        { status }
      );

      const updatedNGO = response.data.ngo;

      setNgos((previous) =>
        previous.map((item) =>
          item._id === ngo._id
            ? {
                ...item,
                ...(updatedNGO || {}),
                isVerified: status === "verified",
                verificationStatus: status,
              }
            : item
        )
      );

      toast.success(
        status === "verified"
          ? `${ngo.name} has been verified.`
          : `${ngo.name} has been rejected.`
      );

      setRejectTarget(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update NGO verification."
      );

      console.error("NGO update error:", err.response?.data || err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b0a] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-7xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-400">
              <Sparkles size={14} />
              TRUST & VERIFICATION
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Verify{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                NGOs
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Review organisation registrations and verify trusted
              FoodShare partners.
            </p>
          </div>

          <button
            onClick={() => fetchNGOs(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Applications
          </button>
        </motion.header>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <span className="flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </span>

              <button
                onClick={() => fetchNGOs(true)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {filters.map((entry, index) => {
            const Icon = entry.icon;

            return (
              <motion.button
                key={entry.value}
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(entry.value)}
                className={`rounded-2xl border p-5 text-left transition ${
                  filter === entry.value
                    ? "border-emerald-500/40 bg-[#18231c]"
                    : "border-white/[0.07] bg-[#121614] hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-400">
                    {entry.label}
                  </span>

                  <Icon
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <motion.p
                  key={counts[entry.value]}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-3xl font-black"
                >
                  {loading ? "—" : counts[entry.value]}
                </motion.p>

                <p className="mt-2 text-xs text-gray-500">
                  NGO applications
                </p>
              </motion.button>
            );
          })}
        </section>

        {/* Search */}
        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-[#121614] p-5">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NGO name, email, or phone..."
              className="w-full rounded-xl border border-white/10 bg-[#090b0a] py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </section>

        {/* NGO cards */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className="h-72 animate-pulse rounded-2xl border border-white/[0.07] bg-[#121614]"
              />
            ))}
          </div>
        ) : visibleNGOs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/[0.07] bg-[#121614] px-6 py-16 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Building2 size={30} />
            </div>

            <h2 className="text-xl font-bold">
              No NGO applications found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try a different filter or search term.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.section
            layout
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visibleNGOs.map((ngo, index) => {
                const status = ngo.isVerified
                  ? "verified"
                  : ngo.verificationStatus === "rejected"
                    ? "rejected"
                    : "pending";

                return (
                  <motion.article
                    layout
                    key={ngo._id}
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121614] p-6 transition hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
                  >
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/[0.04] transition group-hover:scale-150" />

                    {/* Card header */}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/10">
                        <Building2 size={27} />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${
                          status === "verified"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : status === "rejected"
                              ? "border-red-500/20 bg-red-500/10 text-red-400"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {status === "verified" ? (
                          <CheckCircle2 size={13} />
                        ) : status === "rejected" ? (
                          <XCircle size={13} />
                        ) : (
                          <Clock3 size={13} />
                        )}

                        {status}
                      </span>
                    </div>

                    {/* NGO information */}
                    <h2 className="relative mt-5 break-words text-xl font-bold text-white">
                      {ngo.name || "Unnamed NGO"}
                    </h2>

                    <p className="mt-3 flex items-start gap-2 break-all text-sm text-gray-400">
                      <Mail
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />
                      {ngo.email}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                      <Phone
                        size={16}
                        className="shrink-0 text-emerald-400"
                      />
                      {ngo.phone || "Phone not provided"}
                    </p>

                    <div className="my-5 h-px bg-white/[0.07]" />

                    {/* Actions */}
                    {status === "pending" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          disabled={busyId === ngo._id}
                          onClick={() =>
                            updateVerification(ngo, "verified")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:brightness-110 disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          {busyId === ngo._id ? "Saving..." : "Approve"}
                        </button>

                        <button
                          disabled={busyId === ngo._id}
                          onClick={() => setRejectTarget(ngo)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#090b0a] px-3 py-3 text-sm text-gray-400">
                        <ShieldCheck
                          size={17}
                          className={
                            status === "verified"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        />

                        {status === "verified"
                          ? "This organisation is verified."
                          : "This application was rejected."}
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-6 text-xs text-gray-500">
          <Leaf size={14} className="text-emerald-400" />
          Building a trusted FoodShare community
        </footer>
      </main>

      {/* Reject confirmation */}
      <AnimatePresence>
        {rejectTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !busyId) {
                setRejectTarget(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151a17] p-7 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                  <XCircle size={27} />
                </div>

                <button
                  onClick={() => setRejectTarget(null)}
                  disabled={Boolean(busyId)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-xl font-bold">
                Reject this application?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Are you sure you want to reject{" "}
                <strong className="text-white">
                  {rejectTarget.name}
                </strong>
                ?
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  disabled={Boolean(busyId)}
                  onClick={() => setRejectTarget(null)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold text-gray-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  disabled={Boolean(busyId)}
                  onClick={() =>
                    updateVerification(rejectTarget, "rejected")
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {busyId ? "Processing..." : "Confirm Reject"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}