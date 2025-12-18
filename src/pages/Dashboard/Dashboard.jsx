// Updated Dashboard component with premium header, theme-aware stats cards, and consistent UI

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
import { PrimaryButton } from "../../components/PrimaryButton";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Subjects", value: "12", icon: MdBook },
    { label: "Study Streak", value: "7 days", icon: MdLocalFireDepartment },
    { label: "Notes Created", value: "45", icon: MdNotes },
    { label: "Quizzes Completed", value: "28", icon: MdCheckCircle },
  ];

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <PageHeader
        title={`Welcome back, ${user?.name} !👋`}
        content="Here's your learning overview for today"
      />
      {/* STATS */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card bg-primary/35 border border-base-300 shadow-sm hover:shadow-md transition"
              >
                <div className="card-body">
                  <Icon className="text-4xl mb-3 text-primary" />
                  <h3 className="text-sm font-medium text-base-content/70">
                    {stat.label}
                  </h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2">
            <div className="card bg-primary/35 border border-base-300 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl">
                    <MdNotes className="text-2xl text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">Created new note</p>
                      <p className="text-sm text-base-content/70">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl">
                    <MdCheckCircle className="text-2xl text-success" />
                    <div className="flex-1">
                      <p className="font-semibold">Completed Biology Quiz</p>
                      <p className="text-sm text-base-content/70">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl">
                    <MdCardGiftcard className="text-2xl text-secondary" />
                    <div className="flex-1">
                      <p className="font-semibold">Generated flashcards</p>
                      <p className="text-sm text-base-content/70">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="card bg-primary/35 border border-base-300 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-5">
                <PrimaryButton className="btn btn-primary p-2 w-full relative">
                  <MdNotes className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" />
                  <span className="block text-center w-full">Create Note</span>
                </PrimaryButton>

                <PrimaryButton className="btn btn-primary p-2 w-full relative">
                  <MdCardGiftcard className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" />
                  <span className="block text-center w-full">
                    New Flashcard Set
                  </span>
                </PrimaryButton>

                <PrimaryButton className="btn btn-primary p-2 w-full relative">
                  <MdQuiz className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" />
                  <span className="block text-center w-full">Start Quiz</span>
                </PrimaryButton>

                <PrimaryButton className="btn btn-primary p-2 w-full relative">
                  <MdSmartToy className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" />
                  <span className="block text-center w-full">Ask AI</span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
