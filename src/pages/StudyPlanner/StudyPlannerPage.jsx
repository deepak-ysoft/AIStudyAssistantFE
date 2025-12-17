import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { MdCalendarToday } from "react-icons/md";

export default function StudyPlannerPage() {
  const [formData, setFormData] = useState({
    availableHours: "",
    subjects: [],
  });
  const [plan, setPlan] = useState(null);

  const generatePlanMutation = useMutation({
    mutationFn: (data) =>
      aiApi.generateStudyPlan(data.availableHours, data.subjects),
    onSuccess: (response) => {
      setPlan(response.data?.data?.plan);
    },
  });

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    generatePlanMutation.mutate(formData);
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MdCalendarToday className="text-primary" /> Study Planner
        </h1>
        <p className="text-base-content/70">
          Get AI-powered personalized study schedules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  mt-6">
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title mb-4">Create Study Plan</h2>
              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Hours/Week</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 20"
                    className="input input-bordered"
                    value={formData.availableHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableHours: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subjects</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subjects (comma separated)"
                    className="input input-bordered"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjects: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={generatePlanMutation.isPending}
                >
                  {generatePlanMutation.isPending
                    ? "Generating..."
                    : "Generate Plan"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {plan ? (
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <h2 className="card-title mb-4">Your Weekly Schedule</h2>
                <div className="space-y-3">
                  <pre className="bg-base-100 p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(plan, null, 2)}
                  </pre>
                  <button className="btn btn-primary">Download Plan</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center py-12">
                <p className="text-base-content/70">
                  Create a study plan above to see your personalized schedule
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
