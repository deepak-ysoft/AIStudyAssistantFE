import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdQuiz } from "react-icons/md";
import { quizApi } from "../../api/quizApi";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { subjectsApi } from "../../api/subjectsApi";

export default function QuizzesPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    subject: "",
    questions: [],
  });

  /* ------------------ QUERY ------------------ */

  const {
    data: quizzes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: quizApi.getAll,
    select: (res) => res.data?.data || [],
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    select: (res) => res.data?.data || [],
  });

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
    onSuccess: () => {
      alert("Quiz started!");
    },
  });

  const handleSubmit1 = (e) => {
    e.preventDefault();

    if (!formData.questions.length) {
      alert("Please add at least one question");
      return;
    }

    if (isEditMode) {
      updateMutation.mutate({
        id: selectedQuiz._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  /* ------------------ HELPERS ------------------ */

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ title: "", duration: "", subject: "", questions: [] });
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setIsEditMode(true);
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      duration: quiz.duration || "",
      subject:
        typeof quiz.subject === "object"
          ? quiz.subject._id
          : quiz.subject || "",

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
    if (isEditMode) {
      updateMutation.mutate({
        id: selectedQuiz._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdQuiz className="text-blue-600" /> Quizzes
          </h1>
          <p className="text-base-content/70">
            Test your knowledge with quizzes
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          + Create Quiz
        </button>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : quizzes.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="card bg-base-200 shadow-md hover:shadow-lg transition"
            >
              <div className="card-body">
                <h2 className="card-title">{quiz.title}</h2>

                <div className="text-sm space-y-1">
                  <p>
                    <strong>Questions:</strong> {quiz.questions?.length || 0}
                  </p>
                  <p>
                    <strong>Duration :</strong>{" "}
                    {quiz.duration + " min" || "No limit"}
                  </p>
                  <p>
                    <strong>Subject:</strong>{" "}
                    {typeof quiz.subject === "object"
                      ? quiz.subject?.name
                      : quiz.subject || "N/A"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => startQuizMutation.mutate(quiz._id)}
                  >
                    Start
                  </button>

                  <button
                    className="btn btn-xs"
                    onClick={() => openEditModal(quiz)}
                  >
                    View / Edit
                  </button>

                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          No quizzes yet. Create your first quiz!
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-4">
              {isEditMode ? "Update Quiz" : "Create Quiz"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input input-bordered w-full"
                placeholder="Quiz title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                className="input input-bordered w-full"
                placeholder="Duration (mins)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />

              <select
                className="select select-bordered w-full"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg">Questions</h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={addQuestion}
                  >
                    + Add Question
                  </button>
                </div>

                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="border rounded-lg p-4 space-y-3">
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

                    <input
                      className="input input-bordered w-full"
                      placeholder="Question text"
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(qIndex, "question", e.target.value)
                      }
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() =>
                              updateQuestion(qIndex, "correctAnswer", oIndex)
                            }
                          />
                          <input
                            className="input input-bordered w-full"
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Explanation (optional)"
                      value={q.explanation}
                      onChange={(e) =>
                        updateQuestion(qIndex, "explanation", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeModal} />
        </div>
      )}

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
