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

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 overflow-y-auto">
      <ul className="menu p-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <Icon className="text-xl text-primary" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
