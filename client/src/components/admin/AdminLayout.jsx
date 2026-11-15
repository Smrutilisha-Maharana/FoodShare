
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  LogOut,
  Utensils,
  ShieldCheck,
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/admin/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      path: "/admin/manage-users",
      icon: Users,
    },
    {
      name: "Verify Users",
      path: "/admin/verify-users",
      icon: UserCheck,
    },
    {
      name: "Verify NGOs",
      path: "/admin/verify-ngos",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-r border-gray-800 bg-[#111111] md:fixed md:inset-y-0 md:left-0 md:w-64">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-800 px-6 py-6">
          <div className="rounded-xl bg-green-500 p-2">
            <Utensils size={24} className="text-black" />
          </div>

          <div>
            <h1 className="text-xl font-bold">FoodShare</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Admin information */}
        <div className="mx-4 mt-5 flex items-center gap-3 rounded-xl border border-gray-800 bg-[#191919] p-3">
          <div className="rounded-full bg-green-500/15 p-2">
            <ShieldCheck size={20} className="text-green-400" />
          </div>

          <div>
            <p className="text-sm font-semibold">Administrator</p>
            <p className="text-xs text-gray-400">Manage FoodShare</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-green-500 font-semibold text-black shadow-lg shadow-green-500/10"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="min-h-screen min-w-0 flex-1 bg-[#090909] p-4 md:ml-64 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

