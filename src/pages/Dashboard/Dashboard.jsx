import { useAuth } from "../../context/AuthContext";
import {
  MdBook,
  MdLocalFireDepartment,
  MdNotes,
  MdCheckCircle,
  MdCardGiftcard,
  MdQuiz,
  MdSmartToy,
} from "react-icons/md";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Subjects", value: "12", icon: MdBook },
    { label: "Study Streak", value: "7 days", icon: MdLocalFireDepartment },
    { label: "Notes Created", value: "45", icon: MdNotes },
    { label: "Quizzes Completed", value: "28", icon: MdCheckCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-base-content/70">
          Here's your learning overview for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <Icon className="text-4xl mb-2 text-primary" />
                <h3 className="text-sm font-semibold text-base-content/70">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-base-100 rounded">
                  <MdNotes className="text-2xl text-blue-500" />
                  <div className="flex-1">
                    <p className="font-semibold">Created new note</p>
                    <p className="text-sm text-base-content/70">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-base-100 rounded">
                  <MdCheckCircle className="text-2xl text-green-500" />
                  <div className="flex-1">
                    <p className="font-semibold">Completed Biology Quiz</p>
                    <p className="text-sm text-base-content/70">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-base-100 rounded">
                  <MdCardGiftcard className="text-2xl text-purple-500" />
                  <div className="flex-1">
                    <p className="font-semibold">Generated flashcards</p>
                    <p className="text-sm text-base-content/70">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-2">
                <button className="btn btn-primary btn-sm w-full justify-start">
                  <MdNotes className="text-lg" /> Create Note
                </button>
                <button className="btn btn-primary btn-sm w-full justify-start">
                  <MdCardGiftcard className="text-lg" /> New Flashcard Set
                </button>
                <button className="btn btn-primary btn-sm w-full justify-start">
                  <MdQuiz className="text-lg" /> Start Quiz
                </button>
                <button className="btn btn-primary btn-sm w-full justify-start">
                  <MdSmartToy className="text-lg" /> Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
