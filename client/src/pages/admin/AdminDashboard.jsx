import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Building2,
  Package,
  ArrowUpRight,
  Sparkles,
  Leaf,
  RefreshCw,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
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

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    donors: 0,
    ngos: 0,
    donations: 0,
    pendingNGOs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      // Fetch statistics from the admin dashboard API
      const response = await api.get("/admin/dashboard");
      const data = response.data.stats || {};

      setStats({
        users: data.totalUsers ?? 0,
        donors: data.totalDonors ?? 0,
        ngos: data.totalNGOs ?? 0,
        donations: data.totalDonations ?? 0,
        pendingNGOs: data.pendingNGOs ?? 0,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      color: "from-emerald-400 to-green-600",
      shadow: "shadow-emerald-500/10",
      description: "Registered members",
    },
    {
      title: "Food Donors",
      value: stats.donors,
      icon: Heart,
      color: "from-pink-400 to-rose-600",
      shadow: "shadow-pink-500/10",
      description: "Community food donors",
    },
    {
      title: "NGO Partners",
      value: stats.ngos,
      icon: Building2,
      color: "from-violet-400 to-purple-600",
      shadow: "shadow-violet-500/10",
      description: "Registered organisations",
    },
    {
      title: "Total Donations",
      value: stats.donations,
      icon: Package,
      color: "from-sky-400 to-blue-600",
      shadow: "shadow-sky-500/10",
      description: "Donation records",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View members and manage user accounts.",
      path: "/admin/manage-users",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Verify NGOs",
      description: "Review NGO applications and verification.",
      path: "/admin/verify-ngos",
      icon: ShieldCheck,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b0a] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <motion.main
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl"
      >

        {/* Header */}
        <motion.header
          variants={item}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-400">
              <Sparkles size={14} />
              ADMIN CONTROL CENTER
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FoodShare
              </span>
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Monitor your community and make every meal matter.
            </p>
          </div>

          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </motion.header>

        {/* Hero banner */}
        <motion.section
          variants={item}
          className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#123d2b] via-[#0d3025] to-[#102a2c] p-7 shadow-2xl shadow-emerald-950/30 sm:p-10"
        >
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.04]" />
          <div className="absolute -bottom-32 right-36 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <Leaf size={14} />
                MAKING EVERY MEAL MATTER
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Small actions.
                <br />
                <span className="text-emerald-300">
                  A meaningful difference.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300">
                Oversee your FoodShare community, support verified
                organisations, and help connect surplus food with
                people who need it.
              </p>

              <Link
                to="/admin/verify-ngos"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                Review NGO Applications
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="hidden h-36 w-36 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] text-emerald-300 shadow-xl backdrop-blur-xl md:flex">
              <Leaf size={75} strokeWidth={1.3} />
            </div>
          </div>
        </motion.section>

        {/* Statistics heading */}
        <motion.div variants={item} className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Community Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your platform statistics at a glance.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 sm:flex">
            <Activity size={14} />
            Live Overview
          </div>
        </motion.div>

        {/* Statistics cards */}
        <motion.section
          variants={item}
          className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                whileHover={{ y: -5 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121614] p-6 shadow-xl ${card.shadow} transition`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.025] transition group-hover:scale-150" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {card.title}
                    </p>

                    <h3 className="mt-4 text-4xl font-black tracking-tight">
                      {loading ? (
                        <span className="inline-block h-10 w-16 animate-pulse rounded-lg bg-gray-700" />
                      ) : (
                        <AnimatedNumber value={card.value} />
                      )}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500">
                      {card.description}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl bg-gradient-to-br ${card.color} p-3 text-white shadow-lg`}
                  >
                    <Icon size={23} />
                  </div>
                </div>

                <div
                  className={`mt-6 h-1 w-full rounded-full bg-gradient-to-r ${card.color} opacity-60`}
                />
              </motion.article>
            );
          })}
        </motion.section>

        {/* NGO verification alert */}
        <motion.section
          variants={item}
          className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-amber-500/20 bg-[#17140e] p-6 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
              <Clock3 size={25} />
            </div>

            <div>
              <h3 className="font-bold text-white">
                NGO Verification Queue
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {loading
                  ? "Checking pending applications..."
                  : `${stats.pendingNGOs} NGO account(s) currently need review.`}
              </p>
            </div>
          </div>

          <Link
            to="/admin/verify-ngos"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            Review Applications
            <ArrowUpRight size={17} />
          </Link>
        </motion.section>

        {/* Quick actions */}
        <motion.section variants={item}>
          <div className="mb-5">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Quickly access your administration tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-white/[0.07] bg-[#121614] p-6 transition hover:border-emerald-500/30 hover:bg-[#171d19]"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-xl bg-gradient-to-br ${action.color} p-4 text-white shadow-lg`}
                    >
                      <Icon size={27} />
                    </div>

                    <ArrowUpRight
                      size={22}
                      className="text-gray-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-400"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {action.description}
                  </p>

                  <Link
                    to={action.path}
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-emerald-400 transition hover:gap-3"
                  >
                    Open {action.title}
                    <ArrowUpRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={item}
          className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-400" />
            FoodShare Administration
          </span>

          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : "Waiting for dashboard data"}
          </span>
        </motion.footer>

      </motion.main>
    </div>
  );
}