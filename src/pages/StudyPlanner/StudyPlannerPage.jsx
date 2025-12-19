import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { MdCalendarToday } from "react-icons/md";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { FiCalendar } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";

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
    <div >
      {/* heaer */}
      <PageHeader
        icon={MdCalendarToday}
        title="Study Planner"
        content=" Get AI-powered personalized study schedules"
      />
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-3 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT – FORM */}
          <div className="lg:col-span-1">
            <div className="card bg-primary/35 shadow-lg rounded-3xl overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                <h2 className="text-lg font-semibold">Create Study Plan</h2>
                <p className="text-sm text-base-content/70">
                  Generate a personalized weekly schedule
                </p>
              </div>

              <div className="card-body space-y-5">
                <form onSubmit={handleGeneratePlan} className="space-y-4">
                  {/* Available Hours */}
                  <div className="form-control">
                    <FormInput
                      type="number"
                      label="Available Hours / Week"
                      placeholder="e.g. 20"
                      className="input input-bordered w-full"
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

                  {/* Subjects */}
                  <div className="form-control">
                    <FormInput
                      type="text"
                      label="Subjects"
                      placeholder="Math, Physics, Biology"
                      className="input input-bordered w-full"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjects: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Separate subjects using commas
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <PrimaryButton
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={generatePlanMutation.isPending}
                  >
                    {generatePlanMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Generate Plan"
                    )}
                  </PrimaryButton>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT – RESULT */}
          <div className="lg:col-span-2">
            {plan ? (
              <div className="card bg-primary/35 shadow-lg rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                  <h2 className="text-lg font-semibold">
                    Your Weekly Schedule
                  </h2>
                  <p className="text-sm text-base-content/70">
                    AI-generated study plan tailored for you
                  </p>
                </div>

                <div className="card-body space-y-4">
                  <div className="bg-base-100 rounded-2xl p-4 max-h-96 overflow-auto text-sm leading-relaxed">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(plan, null, 2)}
                    </pre>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn btn-outline btn-primary rounded-full">
                      Download Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-primary/35 shadow-lg rounded-3xl">
                <div className="card-body flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary text-2xl">
                      <FiCalendar className="text-primary" />
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">
                    No study plan generated yet
                  </h3>
                  <p className="text-base-content/70 max-w-sm mt-2">
                    Fill in your available time and subjects to generate a
                    personalized weekly study plan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
