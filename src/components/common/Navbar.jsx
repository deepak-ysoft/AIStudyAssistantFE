import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
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
    <nav className="navbar bg-base-200 sticky top-0 z-40 shadow-md flex-shrink-0 px-4 md:px-6 min-h-16">
      <label
        htmlFor="main-drawer"
        className="btn btn-ghost btn-circle md:hidden"
      >
        <MdMenu className="text-xl" />
      </label>
      <div className="flex-none gap-4 ml-auto">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm md:btn-md"
          title={`Theme: ${theme}`}
        >
          {["dark", "dracula", "synthwave", "cyberpunk"].includes(theme) ? (
            <MdLightMode className="text-lg md:text-xl" />
          ) : (
            <MdDarkMode className="text-lg md:text-xl" />
          )}
        </button>

        {user && (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar btn-sm md:btn-md"
            >
              <div className="w-8 md:w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm md:text-base">
                {user.name?.charAt(0) || "U"}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  <span className="truncate">{user.email}</span>
                  <span className="badge badge-sm">Profile</span>
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
