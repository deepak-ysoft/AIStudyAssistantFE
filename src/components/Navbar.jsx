import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MdBook, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-50 h-16 bg-base-100 border-b border-base-300">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <label
          htmlFor="main-drawer"
          className="btn btn-ghost btn-circle md:hidden"
        >
          <MdMenu className="text-xl" />
        </label>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={`Theme: ${theme}`}
          >
            {["dark", "dracula", "synthwave", "cyberpunk"].includes(theme) ? (
              <MdLightMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>

          {user && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                  {user.name?.charAt(0) || "U"}
                </div>
              </label>

              <ul className="dropdown-content menu mt-3 p-2 shadow-lg bg-base-100 rounded-box w-56">
                <li className="px-2 text-sm text-gray-500 truncate">
                  {user.email}
                </li>
                <div className="divider my-1" />
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
