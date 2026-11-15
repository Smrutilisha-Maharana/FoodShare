import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Heart,
  Building2,
  ShieldCheck,
  Search,
  RefreshCw,
  Trash2,
  ChevronDown,
  UserRound,
  Mail,
  Phone,
  Sparkles,
  AlertCircle,
  X,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ROLE_STYLES = {
  donor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ngo: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATS = [
  {
    label: "Total Users",
    key: "total",
    icon: Users,
    color: "from-emerald-400 to-green-600",
  },
  {
    label: "Food Donors",
    key: "donor",
    icon: Heart,
    color: "from-pink-400 to-rose-600",
  },
  {
    label: "NGO Partners",
    key: "ngo",
    icon: Building2,
    color: "from-violet-400 to-purple-600",
  },
  {
    label: "Administrators",
    key: "admin",
    icon: ShieldCheck,
    color: "from-amber-400 to-orange-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyUser, setBusyUser] = useState(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await api.get("/users");
      setUsers(response.data.users || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to load users.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const statistics = useMemo(
    () => ({
      total: users.length,
      donor: users.filter((user) => user.role === "donor").length,
      ngo: users.filter((user) => user.role === "ngo").length,
      admin: users.filter((user) => user.role === "admin").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const updateRole = async (user, newRole) => {
    if (user.role === newRole) return;

    setBusyUser(user._id);

    try {
      await api.patch(`/users/${user._id}/role`, {
        role: newRole,
      });

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? { ...item, role: newRole }
            : item
        )
      );

      toast.success(`${user.name}'s role updated successfully.`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update user role."
      );

      await fetchUsers(true);
    } finally {
      setBusyUser(null);
    }
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;

    const user = deleteTarget;
    setBusyUser(user._id);

    try {
      await api.delete(`/users/${user._id}`);

      setUsers((previous) =>
        previous.filter((item) => item._id !== user._id)
      );

      toast.success(`${user.name} was removed.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete user."
      );
    } finally {
      setBusyUser(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b0a] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl"
      >
        {/* Header */}
        <motion.header
          variants={itemVariants}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-400">
              <Sparkles size={14} />
              ADMIN CONTROL CENTER
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Manage{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Users
              </span>
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Manage your FoodShare community and registered accounts.
            </p>
          </div>

          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Users
          </button>
        </motion.header>

        {/* Error */}
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
                onClick={() => fetchUsers(true)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <motion.section
          variants={itemVariants}
          className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const active =
              roleFilter === (stat.key === "total" ? "all" : stat.key);

            return (
              <motion.button
                key={stat.key}
                type="button"
                onClick={() =>
                  setRoleFilter(stat.key === "total" ? "all" : stat.key)
                }
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-emerald-500/40 bg-[#18231c]"
                    : "border-white/[0.07] bg-[#121614] hover:border-emerald-500/30"
                }`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.025]" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">
                      {stat.label}
                    </p>

                    <p className="mt-4 text-4xl font-black">
                      {loading ? "—" : statistics[stat.key]}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Registered accounts
                    </p>
                  </div>

                  <div
                    className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white shadow-lg`}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        statistics.total > 0
                          ? `${(statistics[stat.key] / statistics.total) * 100}%`
                          : "0%",
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </motion.button>
            );
          })}
        </motion.section>

        {/* User management */}
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121614] shadow-2xl shadow-black/20"
        >
          {/* Panel header */}
          <div className="border-b border-white/[0.07] p-5 sm:p-7">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold">Community Members</h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage registered FoodShare accounts.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {filteredUsers.length} Members
              </div>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, or phone..."
                  className="w-full rounded-xl border border-white/10 bg-[#090b0a] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div className="relative md:w-52">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#090b0a] px-4 py-3 pr-10 text-sm font-medium text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="ngo">NGOs</option>
                  <option value="admin">Admins</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="bg-[#0d110f] text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Verification</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-gray-500"
                    >
                      <RefreshCw className="mx-auto mb-3 animate-spin text-emerald-400" />
                      Loading community members...
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        layout
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group transition hover:bg-emerald-500/[0.035]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white">
                              {user.name?.charAt(0)?.toUpperCase() || (
                                <UserRound size={20} />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {user.name}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                <CalendarDays size={12} />
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString()
                                  : "Date unavailable"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2 text-sm text-gray-400">
                            <p className="flex items-center gap-2">
                              <Mail size={14} className="text-emerald-400" />
                              {user.email}
                            </p>

                            <p className="flex items-center gap-2 text-xs text-gray-500">
                              <Phone size={13} />
                              {user.phone || "Not provided"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="relative w-32">
                            <select
                              aria-label={`Change role for ${user.name}`}
                              value={user.role}
                              disabled={busyUser === user._id}
                              onChange={(e) =>
                                updateRole(user, e.target.value)
                              }
                              className={`w-full appearance-none rounded-lg border px-3 py-2 pr-7 text-xs font-bold capitalize outline-none disabled:opacity-50 ${
                                ROLE_STYLES[user.role] || ROLE_STYLES.donor
                              }`}
                            >
                              <option value="donor">Donor</option>
                              <option value="ngo">NGO</option>
                              <option value="admin">Admin</option>
                            </select>

                            <ChevronDown
                              size={13}
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                              user.isVerified
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.isVerified
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            {user.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setDeleteTarget(user)}
                            disabled={busyUser === user._id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>

            {!loading && filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Search size={32} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-bold">No members found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try another search term or role filter.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                  }}
                  className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.07] px-6 py-4 text-xs text-gray-500 sm:flex-row">
            <span>
              Showing {filteredUsers.length} of {users.length} registered users
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              FoodShare Admin Management
            </span>
          </footer>
        </motion.section>
      </motion.main>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && !busyUser) {
                setDeleteTarget(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151a17] p-7 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                  <Trash2 size={25} />
                </div>

                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={Boolean(busyUser)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-xl font-bold">
                Remove this member?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                You are about to delete{" "}
                <strong className="text-white">
                  {deleteTarget.name}
                </strong>
                . This action cannot be undone.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={Boolean(busyUser)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteUser}
                  disabled={Boolean(busyUser)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {busyUser ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}