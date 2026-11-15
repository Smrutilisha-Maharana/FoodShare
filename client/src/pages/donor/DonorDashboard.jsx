import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DonorSidebar from "../../components/donor/DonorSidebar";

import {
Heart,
Package,
Plus,
ArrowUpRight,
Sparkles,
Leaf,
RefreshCw,
CheckCircle2,
Clock3,
UtensilsCrossed,
HandHeart,
TrendingUp,
Gift,
Menu,
} from "lucide-react";

import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const container = {
hidden: { opacity: 0 },
visible: {
opacity: 1,
transition: { staggerChildren: 0.1 },
},
};

const item = {
hidden: { opacity: 0, y: 22 },
visible: {
opacity: 1,
y: 0,
transition: { duration: 0.45, ease: "easeOut" },
},
};

function AnimatedNumber({ value }) {
const [display, setDisplay] = useState(0);

useEffect(() => {
const target = Number(value) || 0;
const duration = 700;
let start;
let frame;


const animate = (timestamp) => {
  if (!start) start = timestamp;

  const progress = Math.min(
    (timestamp - start) / duration,
    1
  );

  setDisplay(Math.round(target * progress));

  if (progress < 1) {
    frame = requestAnimationFrame(animate);
  }
};

frame = requestAnimationFrame(animate);

return () => cancelAnimationFrame(frame);


}, [value]);

return <>{display.toLocaleString()}</>;
}

export default function DonorDashboard() {
const { user } = useAuth();

const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState("");
const [sidebarOpen, setSidebarOpen] = useState(false);

const fetchDonations = useCallback(async (refresh = false) => {
try {
if (refresh) setRefreshing(true);
else setLoading(true);


  setError("");

  const response = await api.get("/donations/my");

  const data =
    response.data.donations ||
    response.data.data ||
    [];

  setDonations(Array.isArray(data) ? data : []);
} catch (err) {
  const message =
    err.response?.data?.message ||
    "Unable to load donations. Please try again.";

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

const getStatus = (donation) =>
  String(donation.status || "").toLowerCase();

const stats = {
  total: donations.length,

  available: donations.filter(
    (donation) => getStatus(donation) === "available"
  ).length,

  pending: donations.filter(
    (donation) => getStatus(donation) === "requested"
  ).length,

  completed: donations.filter(
    (donation) => getStatus(donation) === "collected"
  ).length,

  expired: donations.filter(
    (donation) => getStatus(donation) === "expired"
  ).length,
};
const cards = [
{
title: "Total Donations",
value: stats.total,
description: "Food shared with the community",
icon: Package,
gradient: "from-emerald-500 to-teal-600",
},
{
title: "Available Donations",
value: stats.available,
description: "Donations awaiting collection",
icon: Clock3,
gradient: "from-amber-500 to-orange-600",
},
{
title: "Completed Donations",
value: stats.completed,
description: "Successfully collected or delivered",
icon: CheckCircle2,
gradient: "from-sky-500 to-blue-600",
},
];

return ( <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-800 dark:bg-[#070b0a] dark:text-slate-100 sm:px-6 lg:px-10 lg:pl-80">


  {/* DONOR SIDEBAR */}
  <DonorSidebar
    open={sidebarOpen}
    onClose={() => setSidebarOpen(false)}
  />

  {/* MOBILE MENU BUTTON */}
  <button
    type="button"
    onClick={() => setSidebarOpen(true)}
    className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 lg:hidden"
    aria-label="Open donor menu"
  >
    <Menu size={23} />
  </button>

  {/* FLOATING BACKGROUND */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div
      animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10"
    />

    <motion.div
      animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
    />
  </div>

  <motion.main
    variants={container}
    initial="hidden"
    animate="visible"
    className="relative mx-auto max-w-7xl"
  >

    {/* HEADER */}
    <motion.header
      variants={item}
      className="mb-8 flex flex-col justify-between gap-5 pt-10 sm:flex-row sm:items-center sm:pt-0"
    >
      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-[#101815] dark:text-emerald-300">
          <Sparkles size={14} />
          DONOR CONTROL CENTER
        </span>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Hello,{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            {user?.name?.split(" ")[0] || "Food Hero"}
          </span>
          !
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Your kindness can turn surplus food into someone else's
          next meal.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => fetchDonations(true)}
        disabled={refreshing}
        className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-60 sm:self-auto"
      >
        <RefreshCw
          size={17}
          className={refreshing ? "animate-spin" : ""}
        />
        Refresh Data
      </motion.button>
    </motion.header>

    {/* HERO BANNER */}
    <motion.section
      variants={item}
      className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-2xl shadow-emerald-900/15 sm:p-9"
    >
      <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

      <motion.div
        animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute right-12 top-12 hidden rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:block"
      >
        <HandHeart size={65} strokeWidth={1.4} />
      </motion.div>

      <div className="relative z-10 max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
          <Heart size={14} />
          SHARE FOOD. SPREAD HOPE.
        </div>

        <h2 className="text-2xl font-black leading-tight sm:text-3xl">
          Good food deserves
          <br />
          <span className="text-emerald-100">
            a second chance.
          </span>
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-6 text-emerald-50 sm:text-base">
          Share your surplus food with people who need it. Every
          donation is a small step toward a world with less food
          waste and more kindness.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/donor/add-donation"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            <Plus size={18} />
            Donate Food
          </Link>

          <Link
            to="/donor/manage-donations"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <Package size={17} />
            My Donations
          </Link>
        </div>
      </div>
    </motion.section>

    {/* STATISTICS */}
    <motion.section
      variants={item}
      className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.article
            key={card.title}
            whileHover={{ y: -6, scale: 1.015 }}
            className="group relative overflow-hidden rounded-3xl border border-white bg-white/90 p-5 shadow-sm transition hover:shadow-xl hover:shadow-emerald-900/5 dark:border-slate-800 dark:bg-[#101815]"
          >
            <div
              className={`absolute -right-7 -top-7 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.08] transition-transform duration-500 group-hover:scale-150`}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <p className="mt-3 text-4xl font-black">
                  {loading ? (
                    <span className="inline-block h-10 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  ) : (
                    <AnimatedNumber value={card.value} />
                  )}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>

              <div
                className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-3 text-white shadow-lg`}
              >
                <Icon size={23} />
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.section>

    {/* QUICK ACTIONS */}
    <motion.section variants={item} className="mb-8">
      <div className="mb-5">
        <h2 className="text-xl font-black">
          Your FoodShare Toolkit
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Everything you need to make your next donation.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <motion.div
          whileHover={{ y: -5 }}
          className="group rounded-3xl border border-white bg-white/90 p-6 shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-[#101815] sm:p-7"
        >
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg shadow-emerald-500/20">
              <UtensilsCrossed size={28} />
            </div>

            <ArrowUpRight
              size={23}
              className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-600"
            />
          </div>

          <h3 className="mt-5 text-xl font-bold">
            Create a Donation
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Have extra food? Add the details and make it available
            to organisations in your community.
          </p>

          <Link
            to="/donor/add-donation"
            className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-700 transition hover:gap-3 dark:text-emerald-400"
          >
            Add Donation
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="group rounded-3xl border border-white bg-white/90 p-6 shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-[#101815] sm:p-7"
        >
          <div className="flex items-start justify-between">
            <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white shadow-lg shadow-violet-500/20">
              <Gift size={28} />
            </div>

            <ArrowUpRight
              size={23}
              className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-600"
            />
          </div>

          <h3 className="mt-5 text-xl font-bold">
            Manage Your Donations
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Check your food listings and monitor their current
            collection status.
          </p>

          <Link
            to="/donor/manage-donations"
            className="mt-5 inline-flex items-center gap-2 font-bold text-violet-700 transition hover:gap-3 dark:text-violet-400"
          >
            View My Donations
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.section>

    {/* RECENT DONATIONS */}
    <motion.section
      variants={item}
      className="overflow-hidden rounded-3xl border border-white bg-white/90 shadow-sm dark:border-slate-800 dark:bg-[#101815]"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-xl font-black">
            Recent Donations
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick look at your latest food listings.
          </p>
        </div>

        <Link
          to="/donor/manage-donations"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 text-sm text-red-600 dark:text-red-400">
          <span>{error}</span>

          <button
            onClick={() => fetchDonations(true)}
            className="font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && donations.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Heart size={30} />
          </div>

          <h3 className="text-lg font-bold">
            Your donation journey starts here!
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            You haven't created any donations yet. Share your
            surplus food and help someone today.
          </p>

          <Link
            to="/donor/add-donation"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
          >
            <Plus size={17} />
            Create First Donation
          </Link>
        </div>
      )}

      {!loading && donations.length > 0 && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {donations.slice(0, 5).map((donation, index) => {
            const status = String(
              donation.status || "pending"
            ).toLowerCase();

            return (
              <motion.div
                key={donation._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                className="flex flex-col gap-3 p-5 transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <Package size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {donation.title ||
                        donation.foodName ||
                        donation.name ||
                        "Food Donation"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {donation.createdAt
                        ? new Date(
                            donation.createdAt
                          ).toLocaleDateString()
                        : "Recently added"}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                    [
                      "completed",
                      "delivered",
                      "collected",
                    ].includes(status)
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : status === "cancelled" ||
                          status === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status === "collected"
  ? "Completed"
  : status === "requested"
  ? "Request Pending"
  : status === "available"
  ? "Available"
  : status === "expired"
  ? "Expired"
  : status}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>

    {/* FOOTER */}
    <motion.footer
      variants={item}
      className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row dark:border-slate-800"
    >
      <span className="inline-flex items-center gap-2">
        <Leaf size={14} className="text-emerald-500" />
        Every donation makes a difference.
      </span>

      <span className="inline-flex items-center gap-2">
        <TrendingUp size={14} className="text-emerald-500" />
        Together toward zero food waste.
      </span>
    </motion.footer>

  </motion.main>
</div>


);
}
