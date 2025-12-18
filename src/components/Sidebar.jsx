import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdBook,
  MdSmartToy,
  MdCalendarToday,
  MdTimer,
  MdAssessment,
} from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { label: "Subjects", icon: MdBook, path: "/subjects" },
  { label: "AI Chat", icon: MdSmartToy, path: "/ai-chat" },
  { label: "Study Planner", icon: MdCalendarToday, path: "/study-planner" },
  { label: "Pomodoro", icon: MdTimer, path: "/pomodoro" },
  { label: "Reports", icon: MdAssessment, path: "/reports" },
];

export default function Sidebar() {
  const location = useLocation();

  const closeDrawer = () => {
    const drawer = document.getElementById("main-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <aside className="w-64 bg-base-100 border-r border-base-300 h-full">
      {/* Logo */}
      <div className="h-16 flex   items-center gap-3 px-5 border-b border-base-300">
        <MdBook className="text-2xl text-primary" />
        <span className="text-lg font-semibold">AI Study Assistant</span>
      </div>

      {/* Nav */}
      <ul className="menu px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={closeDrawer}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition text-lg
          ${
            isActive
              ? "bg-primary text-primary-content shadow-sm shadow-primary/40"
              : "hover:bg-primary/35 text-base-content"
          }`}
              >
                <Icon
                  className={` transition-colors text-2xl
            ${isActive ? "text-primary-content" : "text-primary"}`}
                />
                
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
