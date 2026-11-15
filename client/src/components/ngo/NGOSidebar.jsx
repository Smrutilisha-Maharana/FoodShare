
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Truck,
  Heart,
  LogOut,
  Leaf,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/ngo/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Browse Donations",
    path: "/ngo/browse-donations",
    icon: Search,
  },
  {
    name: "Pickup Requests",
    path: "/ngo/pickup-requests",
    icon: Truck,
  },
];

export default function NGOSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#090e0c] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 text-white shadow-lg shadow-emerald-500/20">
              <Leaf size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                FoodShare
              </h1>

              <p className="text-xs font-bold tracking-widest text-emerald-400">
                NGO PORTAL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-emerald-400"
                  }`
                }
              >
                <Icon size={19} />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="mt-auto p-5">
          <div className="mb-5 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 to-[#10251d] p-5 text-white">
            <Heart size={24} className="mb-3 text-emerald-400" />

            <h3 className="font-bold">
              Small actions matter.
            </h3>

            <p className="mt-2 text-xs leading-5 text-emerald-100/70">
              Every rescued meal is a step toward a world with less food waste.
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold text-rose-400 transition hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
