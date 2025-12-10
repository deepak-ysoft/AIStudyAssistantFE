import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MdBook, MdDarkMode, MdLightMode } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="navbar bg-base-200 sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl flex items-center gap-2">
          <MdBook className="text-2xl text-blue-600" />
          AI Study Assistant
        </a>
      </div>
      <div className="flex-none gap-2">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <MdDarkMode className="text-xl" />
          ) : (
            <MdLightMode className="text-xl" />
          )}
        </button>

        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  {user.email}
                  <span className="badge">Profile</span>
                </a>
              </li>
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
    </nav>
  );
}
