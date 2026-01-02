import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi } from "../../api/dashboardApi";

import {
  MdBook,
  MdLocalFireDepartment,
  MdNotes,
  MdCheckCircle,
  MdAssessment,
  MdRecentActors,
} from "react-icons/md";

import PageHeader from "../../components/PageHeader";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function Dashboard() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState("weekly");

  /* ---------------- DASHBOARD API ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
    select: (res) => res.data.data,
    // 👇 IMPORTANT
    staleTime: 0, // always stale
    refetchOnMount: "always", // refetch when page opens
    refetchOnWindowFocus: true, // refetch when user comes back to tab
  });

  const downloadReport = async () => {
    try {
      const res = await dashboardApi.downloadReport(reportType);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-learning-report.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  const report = data?.reports?.[reportType] || {};

  /* ---------------- STATS ---------------- */
  const stats = [
    {
      label: "Total Subjects",
      value: data?.stats.totalSubjects ?? 0,
      icon: MdBook,
    },
    {
      label: "Study Streak",
      value: data?.stats.studyStreak ?? "0 days",
      icon: MdLocalFireDepartment,
    },
    {
      label: "Notes Created",
      value: data?.stats.notesCreated ?? 0,
      icon: MdNotes,
    },
    {
      label: "Quizzes Completed",
      value: data?.stats.quizzesCompleted ?? 0,
      icon: MdCheckCircle,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name} 👋`}
        content="Here's your complete learning overview"
      />

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card bg-primary/35 border border-base-300 shadow-sm"
            >
              <div className="card-body">
                <Icon className="text-4xl text-primary mb-2" />
                <p className="text-sm text-base-content/70">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- ACTIVITY ---------------- */}
      {/* Recent Activity */}
      <div className=" card bg-primary/35 border shadow-sm">
        <div className="card-body space-y-6">
          <h2 className="card-title flex items-center gap-2">
            <MdRecentActors className="text-primary text-3xl" />
            Recent Activity
          </h2>

          {data?.recentActivity?.length === 0 ? (
            <p className="text-sm text-base-content/60">No recent activity</p>
          ) : (
            <div
              className={`grid gap-3 ${
                data.recentActivity.length === 1
                  ? "grid-cols-1"
                  : data.recentActivity.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {data.recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-base-100 rounded-xl"
                >
                  {a.type === "note" && (
                    <MdNotes className="text-2xl text-primary" />
                  )}
                  {a.type === "quiz" && (
                    <MdCheckCircle className="text-2xl text-success" />
                  )}

                  <div className="flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-base-content/70">
                      {new Date(a.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- REPORTS ---------------- */}
      <div className="card bg-primary/35 border shadow-sm">
        <div className="card-body space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="card-title flex items-center gap-2">
              <MdAssessment className="text-primary text-3xl" />
              <span>Performance Reports</span>
            </h2>

            <div className="flex gap-2">
              {["weekly", "monthly"].map((type) => (
                <PrimaryButton
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`btn px-5 ${
                    reportType === type ? "btn-primary" : ""
                  }`}
                >
                  {type}
                </PrimaryButton>
              ))}
            </div>
          </div>

          {/* Report Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              ["Study Hours", `${report.studyHours || 0}h`],
              ["Topics Covered", report.topicsCovered || 0],
              ["Quiz Avg", `${report.quizAverage || 0}%`],
              ["Improvement", `+${report.improvement || 0}%`],
            ].map(([label, value]) => (
              <div key={label} className="card bg-base-100 shadow">
                <div className="card-body">
                  <p className="text-sm">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subject Performance */}
          <div>
            <h3 className="font-semibold mb-3">Subject Performance</h3>

            {Object.keys(report.subjectPerformance || {}).length === 0 ? (
              <p className="text-sm text-base-content/60">
                No subject data available
              </p>
            ) : (
              Object.entries(report.subjectPerformance).map(
                ([subject, score]) => (
                  <div key={subject} className="flex items-center gap-3 mb-2">
                    <p className="w-32 text-sm">{subject}</p>
                    <progress
                      className="progress progress-primary flex-1"
                      value={score}
                      max="100"
                    />
                    <span className="text-xs">{score}%</span>
                  </div>
                )
              )
            )}
          </div>

          {/* Insights + Download */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <p className="text-sm text-base-content/70 max-w-xl">
              {report.insights ||
                "Stay consistent with daily study to improve performance."}
            </p>

            <PrimaryButton
              className="btn btn-primary px-5"
              onClick={downloadReport}
            >
              Download Report
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
