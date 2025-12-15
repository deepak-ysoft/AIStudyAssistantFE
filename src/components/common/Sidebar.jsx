import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdBook,
  MdNotes,
  MdCardGiftcard,
  MdQuiz,
  MdSmartToy,
  MdCalendarToday,
  MdTimer,
  MdAssessment,
} from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { label: "Subjects", icon: MdBook, path: "/subjects" },
  { label: "Notes", icon: MdNotes, path: "/notes" },
  { label: "Flashcards", icon: MdCardGiftcard, path: "/flashcards" },
  { label: "Quizzes", icon: MdQuiz, path: "/quizzes" },
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
    <aside className="w-64 min-h-full bg-base-100 border-r border-base-300">
      {/* LOGO */}
      <div className="flex items-center gap-2 p-4 m-0.5 bg-base-200 shadow-md">
        <MdBook className="text-2xl text-green-600 " />
        <span className="text-lg font-semibold">AI Study Assistant</span>
      </div>

      {/* NAV */}
      <ul className="menu p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={closeDrawer}
                className={`flex items-center gap-3 rounded-lg
                  ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-200"
                  }`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
