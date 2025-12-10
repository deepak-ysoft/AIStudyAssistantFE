import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../api/reportApi';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('weekly');

  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', reportType],
    queryFn: () =>
      reportType === 'weekly'
        ? reportApi.getWeeklyReport()
        : reportApi.getMonthlyReport(),
    select: (response) => response.data?.data || {},
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">📈 Performance Reports</h1>
        <p className="text-base-content/70">
          Track your learning progress and improvements
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setReportType('weekly')}
          className={`btn ${
            reportType === 'weekly' ? 'btn-primary' : 'btn-ghost'
          }`}
        >
          Weekly Report
        </button>
        <button
          onClick={() => setReportType('monthly')}
          className={`btn ${
            reportType === 'monthly' ? 'btn-primary' : 'btn-ghost'
          }`}
        >
          Monthly Report
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm">Study Hours</h2>
              <p className="text-3xl font-bold text-primary">
                {report.studyHours || '0'}h
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm">Topics Covered</h2>
              <p className="text-3xl font-bold text-secondary">
                {report.topicsCovered || '0'}
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm">Quiz Average</h2>
              <p className="text-3xl font-bold text-accent">
                {report.quizAverage || '0'}%
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm">Improvement</h2>
              <p className="text-3xl font-bold text-success">
                +{report.improvement || '0'}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Subject Performance</h2>
            <div className="space-y-3">
              {report.subjectPerformance ? (
                Object.entries(report.subjectPerformance).map(([subject, score]) => (
                  <div key={subject}>
                    <p className="text-sm font-semibold mb-1">{subject}</p>
                    <progress
                      className="progress progress-primary w-full"
                      value={score}
                      max="100"
                    ></progress>
                    <p className="text-xs text-base-content/70 mt-1">{score}%</p>
                  </div>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
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

      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title mb-4">Weekly Insights</h2>
          <p className="text-base-content/70 mb-4">
            {report.insights || 'Based on your learning patterns, keep focusing on consistent daily practice to improve retention.'}
          </p>
          <button className="btn btn-primary">Download Full Report</button>
        </div>
      </div>
    </div>
  );
}
