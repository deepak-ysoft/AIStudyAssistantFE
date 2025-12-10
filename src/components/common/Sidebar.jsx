import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { label: 'Subjects', icon: '📚', path: '/subjects' },
  { label: 'Notes', icon: '📝', path: '/notes' },
  { label: 'Flashcards', icon: '🎴', path: '/flashcards' },
  { label: 'Quizzes', icon: '❓', path: '/quizzes' },
  { label: 'AI Chat', icon: '💬', path: '/ai-chat' },
  { label: 'Study Planner', icon: '📅', path: '/study-planner' },
  { label: 'Pomodoro', icon: '⏱️', path: '/pomodoro' },
  { label: 'Reports', icon: '📈', path: '/reports' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 overflow-y-auto">
      <ul className="menu p-4 w-full">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
