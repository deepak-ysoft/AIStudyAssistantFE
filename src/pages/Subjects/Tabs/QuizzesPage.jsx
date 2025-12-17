import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdQuiz } from "react-icons/md";
import { FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import { quizApi } from "../../../api/quizApi";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AppModal from "../../../components/AppModal";
import FormInput from "../../../components/FormInput";
import { PrimaryButton } from "../../../components/PrimaryButton";

export default function SubjectQuizzesPage({ subjectId }) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    subject: subjectId,
    questions: [],
  });

  /* ------------------ QUERY ------------------ */

  const {
    data: quizzes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quizzes", subjectId],
    queryFn: () => quizApi.getAll({ subject: subjectId }),
    select: (res) => res.data?.data || [],
    enabled: !!subjectId,
  });

  /* ------------------ QUESTION HELPERS ------------------ */

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index) => {
    const updated = [...formData.questions];
    updated.splice(index, 1);
    setFormData({ ...formData, questions: updated });
  };

  /* ------------------ MUTATIONS ------------------ */

  const createMutation = useMutation({
    mutationFn: quizApi.create,
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => quizApi.update(id, data),
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: quizApi.delete,
    onSuccess: () => {
      setShowDeleteModal(false);
      setSelectedQuiz(null);
      refetch();
    },
  });

  const startQuizMutation = useMutation({
    mutationFn: quizApi.startQuiz,
  });

  /* ------------------ HELPERS ------------------ */

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ title: "", duration: "", subject: subjectId, questions: [] });
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setIsEditMode(true);
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      duration: quiz.duration || "",
      subject:
        typeof quiz.subject === "object" ? quiz.subject._id : quiz.subject,
      questions: quiz.questions || [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedQuiz(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.questions.length) return alert("Add at least one question");

    if (isEditMode) {
      updateMutation.mutate({ id: selectedQuiz._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div>
      {/* HEADER */}
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
              <MdQuiz className="text-primary" /> Quizzes
            </h1>
            <p className="mt-2 text-base-content/70 max-w-md">
              Create and manage quizzes for this subject
            </p>
          </div>

          <PrimaryButton
            onClick={openCreateModal}
            className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
          >
            + New Quiz
          </PrimaryButton>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : quizzes.length ? (
        <div className="space-y-3 max-h-[calc(100vh-380px)] grid grid-cols-2 gap-4 overflow-y-auto py-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="group relative overflow-hidden rounded-3xl bg-base-100 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />
              <div className="p-6 pl-8">
                <div>
                  <h2 className="text-xl font-semibold flex justify-between">
                    {quiz.title}

                    <div className="flex gap-3">
                      <button
                        className="btn btn-circle btn-sm bg-base-200 hover:bg-base-300"
                        onClick={() => startQuizMutation.mutate(quiz._id)}
                      >
                        <FiPlay className="text-success" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-base-200 hover:bg-base-300"
                        onClick={() => openEditModal(quiz)}
                      >
                        <FiEdit2 className="text-primary" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-base-200 hover:bg-base-300"
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 className="text-error" size={16} />
                      </button>
                    </div>
                  </h2>

                  <div className="mt-4 text-sm text-base-content/70 space-y-1">
                    <p>Questions: {quiz.questions?.length || 0}</p>
                    <p>
                      Duration:{" "}
                      {quiz.duration ? quiz.duration + " min" : "No limit"}
                    </p>
                    <p>
                      Subject:{" "}
                      {typeof quiz.subject === "object"
                        ? quiz.subject?.name
                        : quiz.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center py-32 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl" />

          <MdQuiz className="text-6xl text-primary/60 mb-4 z-10" />
          <h3 className="text-2xl font-semibold z-10">No quizzes yet</h3>
          <p className="text-base-content/70 mt-2 max-w-md z-10">
            Create quizzes to test knowledge for this subject
          </p>

          <button
            onClick={openCreateModal}
            className="btn btn-primary rounded-full mt-6 z-10"
          >
            Create your first quiz
          </button>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Update Quiz" : "Create Quiz"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Title"
            placeholder="Quiz title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <FormInput
            label="Duration (minutes)"
            type="number"
            placeholder="Optional"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Questions</h4>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={addQuestion}
              >
                + Add Question
              </button>
            </div>

            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="rounded-2xl border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Question {qIndex + 1}</h5>
                  <button
                    type="button"
                    className="btn btn-xs btn-error"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                </div>

                <FormInput
                  placeholder="Question text"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, "question", e.target.value)
                  }
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center gap-2 rounded-xl border px-3 py-2"
                    >
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() =>
                          updateQuestion(qIndex, "correctAnswer", oIndex)
                        }
                      />
                      <input
                        className="input input-ghost w-full"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        required
                      />
                    </label>
                  ))}
                </div>

                <FormInput
                  type="textarea"
                  placeholder="Explanation (optional)"
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(qIndex, "explanation", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? "Update Quiz" : "Create Quiz"}
            </PrimaryButton>
          </div>
        </form>
      </AppModal>

      {/* DELETE CONFIRM */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${selectedQuiz?.title}"?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedQuiz._id)}
      />
    </div>
  );
}
