import { NavLink, useNavigate } from "react-router-dom";
import {
LayoutDashboard,
Package,
PlusCircle,
ClipboardList,
Heart,
LogOut,
Utensils,
X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DonorSidebar({ open, onClose }) {
const navigate = useNavigate();
const { logout } = useAuth();

const menuItems = [
{
name: "Dashboard",
path: "/donor/dashboard",
icon: LayoutDashboard,
},
{
name: "Add Donation",
path: "/donor/add-donation",
icon: PlusCircle,
},
{
name: "My Donations",
path: "/donor/manage-donations",
icon: Package,
},
{
name: "Pickup Requests",
path: "/donor/pickup-requests",
icon: ClipboardList,
},
];

const handleLogout = () => {
if (logout) logout();
else {
localStorage.removeItem("token");
localStorage.removeItem("user");
}

navigate("/login");


};

return (
<>
{open && ( <div
       onClick={onClose}
       className="fixed inset-0 z-40 bg-black/60 lg:hidden"
     />
)}


  <aside
    className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-emerald-900/40 bg-[#090e0c] text-white transition-transform duration-300 lg:translate-x-0 ${
      open ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-2.5">
          <Utensils size={23} />
        </div>

        <div>
          <h2 className="text-xl font-black">
            Food<span className="text-emerald-400">Share</span>
          </h2>
          <p className="text-xs text-gray-500">
            Donor Panel
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white lg:hidden"
      >
        <X size={22} />
      </button>
    </div>

    <div className="px-5 py-6">
      <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-gray-500">
        Main Menu
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-emerald-400"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>

    <div className="mt-auto border-t border-white/10 p-5">
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#101815] p-3">
        <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-400">
          <Heart size={19} />
        </div>
        <div>
          <p className="text-sm font-bold">Food Hero</p>
          <p className="text-xs text-gray-500">
            Making a difference
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
      >
        <LogOut size={19} />
        Logout
      </button>
    </div>
  </aside>
</>


);
}
