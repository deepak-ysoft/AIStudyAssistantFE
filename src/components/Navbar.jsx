import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { MdPerson, MdSettings, MdLogout } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setIsMenuOpen(false);
    logout();
    navigate("/auth/login");
  };

  /* ✅ Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 h-16 bg-base-100 border-b border-base-300">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <label htmlFor="main-drawer" className="btn btn-circle md:hidden">
          <MdMenu className="text-xl" />
        </label>

        <span className="ml-4 text-sm text-base-content/80 truncate max-w-[180px]">
          Hi,{" "}
          <span className="font-semibold text-base-content">
            {user?.name?.split(" ")[0]}
          </span>
        </span>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-circle"
            title={`Theme: ${theme}`}
          >
            {["dark", "dracula", "synthwave", "cyberpunk"].includes(theme) ? (
              <MdLightMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>

          {/* Avatar + Dropdown */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="btn btn-circle"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <img
                  src={user.avatar}
                  className="p-0.5 rounded-full bg-primary"
                  alt="Avatar"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-lg bg-base-100 border border-base-300 z-50 p-1">
                  {/* Email */}
                  <div className="px-4 py-2 text-sm text-gray-500 truncate">
                    {user.email}
                  </div>

                  <div className="divider mt-0 mb-1" />

                  {/* Profile */}
                  <button
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-left hover:bg-base-200 transition"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <MdPerson className="text-primary text-lg" />
                    <span>Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-left hover:bg-base-200 transition"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <MdSettings className="text-secondary text-lg" />
                    <span>Settings</span>
                  </button>

                  <div className="divider my-1" />

                  {/* Logout */}
                  <button
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-left hover:bg-base-200 transition text-error"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                  >
                    <MdLogout className="text-error text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      <ConfirmLogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
