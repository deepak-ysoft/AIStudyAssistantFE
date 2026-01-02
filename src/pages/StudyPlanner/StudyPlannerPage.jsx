import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { MdCalendarToday } from "react-icons/md";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { FiCalendar } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import { FiPrinter, FiDownload, FiTrash2, FiFileText } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { useToast } from "../../components/ToastContext";

export default function StudyPlannerPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    availableHours: "",
    subjects: [],
  });
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem("weekly-study-plan");
    if (savedPlan) setPlan(savedPlan);
  }, []);

  useEffect(() => {
    if (plan) localStorage.setItem("weekly-study-plan", plan);
  }, [plan]);

  const clearPlan = () => {
    localStorage.removeItem("weekly-study-plan");
    setPlan(null);
  };
  const generatePlanMutation = useMutation({
    mutationFn: (data) =>
      aiApi.generateStudyPlan(data.availableHours, data.subjects),
    onSuccess: (response) => {
      setPlan(response.data?.data?.plan);
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    generatePlanMutation.mutate(formData);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Weekly Study Plan</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
          }
          pre {
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <h1>Weekly Study Plan</h1>
        <pre>${plan}</pre>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  const handleDownloadTxt = () => {
    const blob = new Blob([plan], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "weekly-study-plan.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 15;
    const marginTop = 20;
    const lineHeight = 7;

    doc.setFont("helvetica");
    doc.setFontSize(12);

    doc.text("", marginLeft, 15);

    const lines = doc.splitTextToSize(plan, 180); // wrap text within page width
    let y = marginTop;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - 20) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(lines[i], marginLeft, y);
      y += lineHeight;
    }

    doc.save("weekly-study-plan.pdf");
  };

  return (
    <div>
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
                <form
                  noValidate
                  onSubmit={handleGeneratePlan}
                  className="space-y-4"
                >
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
                    loading={generatePlanMutation.isPending}
                  >
                    Generate Plan
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
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Your Weekly Schedule
                    </h2>
                    <p className="text-sm text-base-content/70">
                      AI-generated study plan tailored for you
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <PrimaryButton
                      onClick={handlePrint}
                      className="btn btn-sm btn-soft btn-primary"
                    >
                      <FiPrinter className="text-base" />
                      Print
                    </PrimaryButton>

                    <PrimaryButton
                      onClick={handleDownloadTxt}
                      className="btn btn-sm btn-soft btn-primary"
                    >
                      <FiFileText className="text-base" />
                      TXT
                    </PrimaryButton>

                    <PrimaryButton
                      onClick={handleDownloadPdf}
                      className="btn btn-sm btn-soft btn-primary"
                    >
                      <HiOutlineDocumentDownload className="text-base" />
                      PDF
                    </PrimaryButton>
                  </div>
                </div>

                <div className="card-body space-y-4 relative">
                  {/* Floating Clear Button */}
                  <div className="absolute top-2 right-5 z-10">
                    <PrimaryButton
                      onClick={clearPlan}
                      className="btn btn-sm btn-soft btn-accent tooltip tooltip-left"
                      data-tip="Clear plan"
                    >
                      <FiTrash2 className="text-lg" />
                    </PrimaryButton>
                  </div>

                  {/* Content */}
                  <div className="bg-base-100 rounded-2xl p-4 max-h-96 overflow-auto text-sm leading-relaxed">
                    <pre className="whitespace-pre-wrap">{plan}</pre>
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
