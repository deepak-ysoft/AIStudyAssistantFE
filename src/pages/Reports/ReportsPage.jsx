import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../../api/reportApi";
import { MdAssessment } from "react-icons/md";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("weekly");

  const {
    data: report = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports", reportType],
    queryFn: () =>
      reportType === "weekly"
        ? reportApi.getWeeklyReport()
        : reportApi.getMonthlyReport(),
    select: (response) => response.data?.data || {},
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex gap-3">
            <MdAssessment className="text-primary" /> Performance Reports
          </h1>
          <p className="text-base-content/70">
            Track your learning progress and improvements
          </p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      </div>
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8 ">
        <div className="flex gap-2  mt-6">
          <button
            onClick={() => setReportType("weekly")}
            className={`btn tab ${
              reportType === "weekly" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setReportType("monthly")}
            className={`btn ${
              reportType === "monthly" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Monthly Report
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error  mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m6-8a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Failed to load reports. Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-6">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm">Study Hours</h2>
                <p className="text-3xl font-bold text-primary">
                  {report?.studyHours || "0"}h
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm">Topics Covered</h2>
                <p className="text-3xl font-bold text-secondary">
                  {report?.topicsCovered || "0"}
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm">Quiz Average</h2>
                <p className="text-3xl font-bold text-accent">
                  {report?.quizAverage || "0"}%
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title text-sm">Improvement</h2>
                <p className="text-3xl font-bold text-success">
                  +{report?.improvement || "0"}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  mt-6">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Subject Performance</h2>
              <div className="space-y-3">
                {report?.subjectPerformance &&
                Object.keys(report.subjectPerformance).length > 0 ? (
                  Object.entries(report.subjectPerformance).map(
                    ([subject, score]) => (
                      <div key={subject}>
                        <p className="text-sm font-semibold mb-1">{subject}</p>
                        <progress
                          className="progress progress-primary w-full"
                          value={score}
                          max="100"
                        ></progress>
                        <p className="text-xs text-base-content/70 mt-1">
                          {score}%
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-base-content/70">
                    No subject performance data available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-md ">
            <div className="card-body">
              <h2 className="card-title">Recommendations</h2>
              <ul className="space-y-2 text-sm">
                <li>✓ Focus on weak areas in Mathematics</li>
                <li>✓ Increase practice time for Physics problems</li>
                <li>✓ Review Chemistry notes before next quiz</li>
                <li>✓ You're on a great 7-day streak! Keep it up!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md  mt-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Weekly Insights</h2>
            <p className="text-base-content/70 mb-4">
              {report?.insights ||
                "Based on your learning patterns, keep focusing on consistent daily practice to improve retention."}
            </p>
            <button className="btn btn-primary">Download Full Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
