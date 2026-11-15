import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar({ isDarkMode, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const linkClassName = ({ isActive }) =>
    `transition-colors hover:text-green-600 dark:hover:text-green-400 ${
      isActive ? "font-semibold text-green-600 dark:text-green-400" : ""
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-green-100 bg-white/90 shadow-sm backdrop-blur transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <Link
          className="text-2xl font-bold text-green-700 transition-transform duration-300 hover:scale-105 dark:text-green-400"
          onClick={closeMenu}
          to="/"
        >
          FoodShare
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink className={linkClassName} to="/">
            Home
          </NavLink>
          <a
            className="transition-colors hover:text-green-600 dark:hover:text-green-400"
            href="/#about"
          >
            About
          </a>
          <NavLink className={linkClassName} to="/login">
            Login
          </NavLink>
          <Link
            className="rounded-lg bg-green-600 px-5 py-2 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md"
            to="/register"
          >
            Get Started
          </Link>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={22} />
            ) : (
              <Menu aria-hidden="true" size={22} />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-gray-100 px-6 pb-5 pt-3 dark:border-gray-800 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink className={linkClassName} onClick={closeMenu} to="/">
              Home
            </NavLink>
            <a
              className="transition-colors hover:text-green-600 dark:hover:text-green-400"
              href="/#about"
              onClick={closeMenu}
            >
              About
            </a>
            <NavLink className={linkClassName} onClick={closeMenu} to="/login">
              Login
            </NavLink>
            <Link
              className="w-fit rounded-lg bg-green-600 px-5 py-2 text-white transition-colors hover:bg-green-700"
              onClick={closeMenu}
              to="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;