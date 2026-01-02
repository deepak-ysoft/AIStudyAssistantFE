import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdQuiz } from "react-icons/md";
import { FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import { quizApi } from "../../../api/quizApi";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AppModal from "../../../components/AppModal";
import FormInput from "../../../components/FormInput";
import { PrimaryButton } from "../../../components/PrimaryButton";
import PageHeader from "../../../components/PageHeader";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { RiTimerFill } from "react-icons/ri";
import { useToast } from "../../../components/ToastContext";

export default function SubjectQuizzesPage({ subjectId }) {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizEndedByTimeout, setQuizEndedByTimeout] = useState(false);

  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    subject: subjectId,
    questions: [],
  });

  useEffect(() => {
    if (!quizModalOpen || showResult) return;

    if (timeLeft <= 0) {
      setQuizEndedByTimeout(true);
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizModalOpen, timeLeft, showResult]);

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
    // 👇 IMPORTANT
    staleTime: 0, // always stale
    refetchOnMount: "always", // refetch when page opens
    refetchOnWindowFocus: true, // refetch when user comes back to tab
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

  const score = activeQuiz
    ? activeQuiz.questions.reduce((acc, q, i) => {
        return acc + (answers[i] === q.correctAnswer ? 1 : 0);
      }, 0)
    : 0;

  const isCorrect = (qIndex, optionIndex) => {
    return (
      answers[qIndex] !== undefined &&
      optionIndex === activeQuiz.questions[qIndex].correctAnswer
    );
  };

  const isWrong = (qIndex, optionIndex) => {
    return (
      answers[qIndex] === optionIndex &&
      optionIndex !== activeQuiz.questions[qIndex].correctAnswer
    );
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const selectAnswer = (idx) => {
    const updated = [...answers];
    updated[currentQuestion] = idx;
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion((q) => q + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);

    if (!activeQuiz) return;

    const timeSpent = activeQuiz.duration
      ? activeQuiz.duration * 60 - timeLeft
      : 0;

    const passed = score > (activeQuiz.passingMarks || 0);
    saveQuizAttemptMutation.mutate({
      quizId: activeQuiz._id,
      userId: "CURRENT_USER_ID", // replace with actual logged-in user id
      answers,
      score,
      passed,
      timeTaken: timeSpent,
    });
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizEndedByTimeout(false);

    const seconds = quiz.duration ? quiz.duration * 60 : 0;
    setTimeLeft(seconds);

    setQuizModalOpen(true);
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
    mutationFn: ({ id, data }) => quizApi.update(id, data),
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
    mutationFn: quizApi.delete,
    onSuccess: (response) => {
      setShowDeleteModal(false);
      setSelectedQuiz(null);
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

  const saveQuizAttemptMutation = useMutation({
    mutationFn: (attemptData) => quizApi.saveAttempt(attemptData),
    onSuccess: (response) => {
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
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
      <PageHeader
        icon={MdQuiz}
        title="Quizzes"
        content=" Create and manage quizzes for this subject"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Quiz
        </PrimaryButton>
      </PageHeader>

      {/* LIST */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : quizzes.length ? (
          <div
            className={`${
              quizzes.length === 1
                ? "grid grid-cols-1"
                : "grid grid-cols-1 md:grid-cols-2"
            } gap-4 p-1 sm:p-6`}
          >
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="group relative overflow-hidden rounded-3xl bg-base-100 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />
                <div className="p-6 pl-8">
                  <h2 className="text-xl font-semibold flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                    <div className="order-2 xl:order-1"> {quiz.title}</div>
                    <div className="order-1 xl:order-2  flex  gap-3">
                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={() => startQuiz(quiz)}
                      >
                        <FiPlay className="text-success" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={() => openEditModal(quiz)}
                      >
                        <FiEdit2 className="text-primary" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
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
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center py-32 text-center h-[calc(60vh-60px)]">
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
      </div>

      {/* Start Quiz Modal */}
      <AppModal
        open={quizModalOpen}
        title={activeQuiz?.title || "Quiz"}
        onClose={() => {
          setQuizModalOpen(false);
          setActiveQuiz(null);
          setShowResult(false);
        }}
      >
        {activeQuiz && !showResult && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Question {currentQuestion + 1} / {activeQuiz.questions.length}
              </p>
              {activeQuiz.duration && (
                <span className="font-mono text-error flex gap-3 items-center">
                  <RiTimerFill className="w-7 h-7" /> {formatTime(timeLeft)}
                </span>
              )}
            </div>

            <p className="text-lg font-semibold">
              {activeQuiz.questions[currentQuestion].question}
            </p>

            <div className="space-y-2">
              {activeQuiz.questions[currentQuestion].options.map((opt, idx) => {
                const answered = answers[currentQuestion] !== undefined;

                let btnClass = "btn-outline";

                if (answered) {
                  if (isCorrect(currentQuestion, idx)) {
                    btnClass = "btn-success";
                  } else if (isWrong(currentQuestion, idx)) {
                    btnClass = "btn-error";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    className={`
    w-full text-left rounded-xl px-4 py-3 text-sm transition-all
    border
    ${answered ? "pointer-events-none" : "hover:bg-base-200"}
    ${
      isCorrect(currentQuestion, idx)
        ? "border-success bg-success/10 text-success"
        : isWrong(currentQuestion, idx)
        ? "border-error bg-error/10 text-error"
        : "border-base-300 bg-base-100 text-base-content"
    }
  `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answers[currentQuestion] !== undefined && (
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
      ${
        answers[currentQuestion] ===
        activeQuiz.questions[currentQuestion].correctAnswer
          ? "bg-success/10 text-success"
          : "bg-error/10 text-error"
      }
    `}
              >
                {answers[currentQuestion] ===
                activeQuiz.questions[currentQuestion].correctAnswer ? (
                  <>
                    <FiCheckCircle className="text-lg" />
                    <span>Correct answer</span>
                  </>
                ) : (
                  <>
                    <FiXCircle className="text-lg" />
                    <span>Wrong answer</span>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <PrimaryButton
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion + 1 === activeQuiz.questions.length
                  ? "Finish Quiz"
                  : "Next"}
              </PrimaryButton>
            </div>
          </div>
        )}
        {activeQuiz && showResult && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Quiz Result</h2>

              <p className="text-lg mt-2">
                Score:{" "}
                <span className="font-semibold text-success">
                  {score} / {activeQuiz.questions.length}
                </span>
              </p>

              <p className="mt-1">
                Status:{" "}
                {score > activeQuiz.passingMarks ? (
                  <span className="text-success font-semibold">Passed</span>
                ) : (
                  <span className="text-error font-semibold">Failed</span>
                )}
              </p>

              <p className="text-sm text-base-content/70 mt-1">
                Attempted {answers.filter((a) => a !== undefined).length} /{" "}
                {activeQuiz.questions.length} questions
              </p>
            </div>

            {quizEndedByTimeout && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-warning/15 px-4 py-2 text-warning font-medium">
                <RiTimerFill className="text-lg" />
                <span>Time’s up! Quiz auto-submitted</span>
              </div>
            )}
            {/* Question Review */}
            <div className="space-y-4">
              {activeQuiz.questions.map((q, qIndex) => {
                const userAnswer = answers[qIndex];

                if (userAnswer === undefined) return null; // 👈 skip unattempted

                return (
                  <div
                    key={qIndex}
                    className="border rounded-2xl p-4 space-y-2"
                  >
                    <p className="font-medium">
                      Q{qIndex + 1}. {q.question}
                    </p>

                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-2 rounded-lg
            ${
              oIndex === q.correctAnswer
                ? "bg-success/20 text-success"
                : userAnswer === oIndex
                ? "bg-error/20 text-error"
                : "bg-base-200"
            }
          `}
                      >
                        {opt}
                      </div>
                    ))}

                    {q.explanation && (
                      <p className="text-sm text-base-content/70">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={() => setQuizModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AppModal>

      {/* CREATE / EDIT MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Update Quiz" : "Create Quiz"}
        onClose={closeModal}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
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
                className="btn btn-sm btn-primary btn-outline"
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
                    className="btn btn-xs btn-accent btn-outline"
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
            <button type="button" className="btn " onClick={closeModal}>
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
