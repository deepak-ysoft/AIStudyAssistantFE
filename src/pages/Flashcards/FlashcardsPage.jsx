import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdCardGiftcard } from "react-icons/md";
import { flashcardApi } from "../../api/flashcardApi";
import { subjectsApi } from "../../api/subjectsApi";

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  /* ---------- MODAL STATE ---------- */
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  /* ---------- QUERY ---------- */
  const {
    data: flashcards = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["flashcards"],
    queryFn: flashcardApi.getAll,
    select: (res) => res.data?.data || [],
  });

  const currentCard = flashcards[currentIndex];

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    select: (res) => res.data?.data || [],
  });

  /* ---------- MUTATIONS ---------- */
  const createMutation = useMutation({
    mutationFn: flashcardApi.create,
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => flashcardApi.update(id, data),
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, isCorrect }) => flashcardApi.review(id, isCorrect),
    onSuccess: () => {
      refetch();
      handleNext();
    },
  });

  /* ---------- HANDLERS ---------- */
  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ question: "", answer: "" });
    setShowModal(true);
  };

  const openEditModal = (card) => {
    setIsEditMode(true);
    setSelectedCard(card);
    setFormData({
      question: card.question,
      answer: card.answer,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
    setIsEditMode(false);
    setFormData({ question: "", answer: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateMutation.mutate({
        id: selectedCard._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkLearned = () => {
    reviewMutation.mutate({
      id: currentCard._id,
      isCorrect: true,
    });
  };

  const handleWrong = () => {
    reviewMutation.mutate({
      id: currentCard._id,
      isCorrect: false,
    });
  };

  /* ---------- UI ---------- */
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdCardGiftcard className="text-blue-600" /> Flashcards
          </h1>
          <p className="text-base-content/70">
            Learn with interactive flashcards
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          + Create Card
        </button>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : flashcards.length ? (
        <div className="space-y-6 mt-6">
          {/* CARD */}
          <div
            className="h-64 flex items-center justify-center cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="card bg-gradient-to-r from-primary to-secondary w-full shadow-xl">
              <div className="card-body flex items-center justify-center min-h-64">
                <div className="text-center">
                  <p className="text-sm text-base-100/70 mb-4">
                    {isFlipped ? "Answer" : "Question"} ({currentIndex + 1}/
                    {flashcards.length})
                  </p>

                  <p className="text-2xl font-bold text-base-100">
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </p>

                  <p className="text-xs text-base-100/50 mt-4">Click to flip</p>
                </div>
              </div>
            </div>
          </div>

          {/* NAV */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn btn-outline"
            >
              ← Previous
            </button>

            <button
              className="btn btn-sm btn-ghost"
              onClick={() => openEditModal(currentCard)}
            >
              Edit Card
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="btn btn-outline"
            >
              Next →
            </button>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-success" onClick={handleMarkLearned}>
              Mark as Learned
            </button>

            <button className="btn btn-error" onClick={handleWrong}>
              Wrong
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <p className="text-base-content/70 text-lg">
            No flashcards yet. Create one to get started!
          </p>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {isEditMode ? "Edit Flashcard" : "Create Flashcard"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    question: e.target.value,
                  })
                }
                required
              />

              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    answer: e.target.value,
                  })
                }
                required
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
    </div>
  );
}
