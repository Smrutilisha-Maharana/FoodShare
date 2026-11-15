import {
  BarChart3,
  ClipboardList,
  HandHeart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const CURRENT_USER_KEY = "foodshare-current-user";

const navigationByRole = {
  donor: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/donor/dashboard" },
    { label: "Add donation", icon: HandHeart, to: "/donor/donations/add" },
    { label: "My donations", icon: ClipboardList, to: "/donor/donations" },
  ],
  ngo: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/ngo/dashboard" },
    { label: "Browse donations", icon: HandHeart, to: "/ngo/donations" },
    { label: "Pickup requests", icon: ClipboardList, to: "/ngo/requests" },
  ],
  volunteer: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/volunteer/dashboard" },
    { label: "Available tasks", icon: ClipboardList, to: "/volunteer/tasks" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
    { label: "Manage users", icon: Users, to: "/admin/users" },
    { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  ],
};

function Sidebar({ role = "donor", isOpen, onClose }) {
  const navigate = useNavigate();
  const navigationItems = navigationByRole[role] || navigationByRole.donor;

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    onClose?.();
    navigate("/login");
  };

  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300"
        : "text-gray-600 hover:bg-gray-100 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-green-300"
    }`;

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white px-4 py-5 shadow-lg transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:static md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <NavLink
            className="text-2xl font-bold text-green-700 dark:text-green-400"
            onClick={onClose}
            to="/"
          >
            FoodShare
          </NavLink>
          <button
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {role} portal
        </p>
        <nav aria-label={`${role} navigation`} className="space-y-1">
          {navigationItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              className={linkClassName}
              key={to}
              onClick={onClose}
              to={to}
            >
              <Icon aria-hidden="true" size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-gray-200 pt-4 dark:border-gray-800">
          <NavLink className={linkClassName} onClick={onClose} to="/settings">
            <Settings aria-hidden="true" size={19} />
            Settings
          </NavLink>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            onClick={handleLogout}
            type="button"
          >
            <LogOut aria-hidden="true" size={19} />
            Sign out
          </button>
        </div>
      </aside>

      <button
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-20 rounded-lg bg-white p-2 text-gray-700 shadow-md dark:bg-gray-900 dark:text-gray-200 md:hidden"
        onClick={() => onClose?.(true)}
        type="button"
      >
        <Menu aria-hidden="true" size={22} />
      </button>
    </>
  );
}

export default Sidebar;