import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { subjectsApi } from "../../api/subjectsApi";
import { aiApi } from "../../api/aiApi";
import { MdBook } from "react-icons/md";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/PrimaryButton";
import AppModal from "../../components/AppModal";
import FormInput from "../../components/FormInput";
import PageHeader from "../../components/PageHeader";
import { useToast } from "../../components/ToastContext";
import { FaRobot } from "react-icons/fa6";

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsSubject, setDetailsSubject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [limit, setLimit] = useState(5);
  const [regenerate, setRegenerate] = useState(false);

  /* ---------------- QUERY ---------------- */

  const {
    data: subjects = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    select: (res) => res.data?.data || [],
    // 👇 IMPORTANT
    staleTime: 0, // always stale
    refetchOnMount: "always", // refetch when page opens
    refetchOnWindowFocus: true, // refetch when user comes back to tab
  });

  /* ---------------- MUTATIONS ---------------- */

  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: (response) => {
      closeModal();
      refetch();
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectsApi.update(id, data),
    onSuccess: (response) => {
      closeModal();
      refetch();
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: (response) => {
      setShowDeleteModal(false);
      setSelectedSubject(null);
      refetch();
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const generateNotesMutation = useMutation({
    mutationFn: aiApi.generateNotes,
    onSuccess: (res) => {
      showToast(res.data.message, "success");
      setShowAIModal(false);
      setAiPrompt("");
      refetch(); // refetch notes
    },
    onError: (err) => {
      showToast(
        err?.response?.data?.message || "Failed to generate notes",
        "error"
      );
    },
  });
  /* ---------------- HELPERS ---------------- */

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (formData.description.length < 100) {
      newErrors.description = "Description must be at least 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setFormData({ name: subject.name, description: subject.description });
    setShowModal(true);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedSubject(null);
    setFormData({ name: "", description: "" });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode) {
      updateMutation.mutate({ id: selectedSubject._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    setErrors({});
  };

  const openDetailsModal = (note) => {
    setDetailsSubject(note);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsSubject(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdBook}
        title="Subjects"
        content="Organize your learning into focused subjects"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Subject
        </PrimaryButton>
      </PageHeader>
      {/* LIST */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : subjects.length ? (
          <div
            className={`${
              subjects.length >= 3
                ? "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3"
                : subjects.length === 2
                ? "grid grid-cols-1 md:grid-cols-2"
                : subjects.length === 1
                ? "grid grid-cols-1"
                : ""
            } m-2 sm:m-5 gap-6`}
          >
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="group relative overflow-hidden rounded-3xl bg-base-100 shadow-lg transition-all hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/subjects/${subject._id}`)}
              >
                {/* Accent bar */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />

                <div className="p-6 pl-8">
                  <h2 className="text-xl font-semibold flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                    <div className="order-2 xl:order-1 ">{subject.name}</div>
                    <div className="order-1 xl:order-2 flex gap-2 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(subject);
                        }}
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                      >
                        <FiEdit2 className="text-primary" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailsModal(subject);
                        }}
                      >
                        <FiEye className="text-info" size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubject(subject);
                          setShowDeleteModal(true);
                        }}
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                      >
                        <FiTrash2 className="text-error" size={16} />
                      </button>
                    </div>
                  </h2>
                  <p className="mt-3 text-sm text-base-content/70 line-clamp-3">
                    {subject.description || "No description provided"}
                  </p>
                  <PrimaryButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubject(subject);
                      setShowAIModal(true);
                    }}
                    className="btn ml-auto mt-4 flex items-center gap-2"
                  >
                    <FaRobot className="text-xl text-info" /> Generate Notes
                    with AI
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center py-32 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl" />

            <MdBook className="text-6xl text-primary/60 mb-4 z-10" />
            <h3 className="text-2xl font-semibold z-10">No subjects yet</h3>
            <p className="text-base-content/70 mt-2 max-w-md z-10">
              Create subjects to organize notes, quizzes, and flashcards
            </p>

            <button
              onClick={openCreateModal}
              className="btn btn-primary rounded-full mt-6 z-10"
            >
              Create your first subject
            </button>
          </div>
        )}
      </div>
      {/* CREATE / UPDATE MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Update Subject" : "Create Subject"}
        onClose={closeModal}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Name"
            placeholder="Subject name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: "" }); // clear on change
            }}
            required
            error={errors.name}
          />

          <FormInput
            label="Description"
            type="textarea"
            placeholder="Short description (optional)"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: "" });
            }}
            error={errors.description}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn " onClick={closeModal}>
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? "Update Subject" : "Create Subject"}
            </PrimaryButton>
          </div>
        </form>
      </AppModal>

      {/* Details Modal */}
      <AppModal
        open={showDetailsModal}
        title="Subject Details"
        onClose={closeDetailsModal}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{detailsSubject?.name}</h2>
          </div>

          <div className="rounded-2xl bg-primary/35 p-5 max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {detailsSubject?.description || "No description provided"}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button className="btn " onClick={closeDetailsModal}>
              Close
            </button>
          </div>
        </div>
      </AppModal>

      {/* AI NOTES MODAL */}
      <AppModal
        open={showAIModal}
        title="Generate AI Notes"
        onClose={() => setShowAIModal(false)}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            generateNotesMutation.mutate({
              subjectId: selectedSubject._id,
              prompt: aiPrompt,
              difficulty,
              limit,
              regenerate,
            });
          }}
        >
          <FormInput
            label="Topic / Prompt"
            placeholder="e.g. React, React Components, Hooks"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Difficulty</label>
              <select
                className="select select-bordered w-full"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="label">Number of Notes</label>
              <input
                type="number"
                min={1}
                max={10}
                className="input input-bordered w-full"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              checked={regenerate}
              onChange={(e) => setRegenerate(e.target.checked)}
            />
            <span className="text-sm">Regenerate (delete old AI notes)</span>
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              className="btn"
              onClick={() => setShowAIModal(false)}
            >
              Cancel
            </button>

            <PrimaryButton
              type="submit"
              loading={generateNotesMutation.isPending}
            >
              Generate Notes
            </PrimaryButton>
          </div>
        </form>
      </AppModal>

      {/* DELETE CONFIRM */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Subject"
        message={`Are you sure you want to delete \"${selectedSubject?.name}\"?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedSubject._id)}
      />
    </div>
  );
}
