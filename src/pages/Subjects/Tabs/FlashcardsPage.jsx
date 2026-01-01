import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdCardGiftcard } from "react-icons/md";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { flashcardApi } from "../../../api/flashcardApi";
import { PrimaryButton } from "../../../components/PrimaryButton";
import AppModal from "../../../components/AppModal";
import FormInput from "../../../components/FormInput";
import PageHeader from "../../../components/PageHeader";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

export default function SubjectFlashcardsPage({ subjectId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    subject: subjectId,
  });

  /* ---------------- QUERY ---------------- */

  const {
    data: flashcards = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["flashcards", subjectId],
    queryFn: () => flashcardApi.getAll({ subject: subjectId }),
    select: (res) => res.data?.data || [],
    enabled: !!subjectId,
  });

  const currentCard = flashcards[currentIndex];
  /* ---------------- MUTATIONS ---------------- */

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

  const deleteMutation = useMutation({
    mutationFn: flashcardApi.delete,
    onSuccess: () => {
      setShowDeleteModal(false);
      setSelectedCard(null);
      refetch();
    },
  });

  /* ---------------- HELPERS ---------------- */

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ question: "", answer: "", subject: subjectId });
    setShowModal(true);
  };

  const openEditModal = (card) => {
    setIsEditMode(true);
    setSelectedCard(card);
    setFormData({
      question: card.question,
      answer: card.answer,
      subject: card.subject?._id || subjectId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedCard(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateMutation.mutate({ id: selectedCard._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((p) => p + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkLearned = (correct) => {
    reviewMutation.mutate({ id: currentCard._id, isCorrect: correct });
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdCardGiftcard}
        title="Flashcards"
        content="  Learn faster with interactive flashcards"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Card
        </PrimaryButton>
      </PageHeader>
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 bg-primary/20 blur-3xl" />

      {/* CONTENT */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : flashcards.length ? (
          <div className="space-y-8 p-1 sm:p-6">
            {/* FLASHCARD */}
            <div
              className="relative mx-auto cursor-pointer"
              onClick={() => setIsFlipped((p) => !p)}
            >
              <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-10 shadow-xl min-h-[260px] flex items-center justify-center">
                <div className="text-center text-base-100">
                  <p className="text-sm opacity-80 mb-4">
                    {isFlipped ? "Answer" : "Question"} • {currentIndex + 1} /{" "}
                    {flashcards.length}
                  </p>
                  <p className="text-2xl font-semibold">
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </p>

                  <p className="mt-6 text-xs opacity-60">Tap to flip</p>
                </div>
              </div>

              {/* EDIT ICON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(currentCard);
                }}
                className="absolute top-4 right-4 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100"
              >
                <FiEdit2 className="text-primary" />
              </button>
              <button
                className="absolute bottom-4 right-4 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCard(currentCard);
                  setShowDeleteModal(true);
                }}
              >
                <FiTrash2 className="text-error" size={16} />
              </button>
            </div>

            {/* REVIEW ACTIONS */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <PrimaryButton
                className="btn bg-primary/50 hover:bg-primary/70"
                onClick={() => handleMarkLearned(true)}
              >
                {currentCard.correctCount > 0 ? (
                  <p>{currentCard.correctCount}</p>
                ) : null}{" "}
                Mark as Learned
              </PrimaryButton>

              <PrimaryButton
                className="btn bg-secondary/50  hover:bg-secondary/70"
                onClick={() => handleMarkLearned(false)}
              >
                {currentCard.wrongCount > 0 ? (
                  <p>{currentCard.wrongCount}</p>
                ) : null}{" "}
                Wrong
              </PrimaryButton>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center max-w-md mx-auto">
              <PrimaryButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Previous
              </PrimaryButton>

              <PrimaryButton
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
              >
                Next →
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center py-32 text-center h-[calc(60vh-60px)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl" />

            <MdCardGiftcard className="text-6xl text-primary/60 mb-4 z-10" />
            <h3 className="text-2xl font-semibold z-10">No flashcards yet</h3>
            <p className="text-base-content/70 mt-2 max-w-md z-10">
              Create flashcards and start learning effectively
            </p>

            <button
              onClick={openCreateModal}
              className="btn btn-primary mt-6 z-10"
            >
              Create your first card
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Edit Flashcard" : "Create Flashcard"}
        onClose={closeModal}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Question"
            type="textarea"
            placeholder="Enter the question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
          />

          <FormInput
            label="Answer"
            type="textarea"
            placeholder="Enter the answer"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn " onClick={closeModal}>
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? "Update Card" : "Create Card"}
            </PrimaryButton>
          </div>
        </form>
      </AppModal>

      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Card"
        message={`Are you sure you want to delete?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedCard._id)}
      />
    </div>
  );
}
