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
import { useToast } from "../../../components/ToastContext";
import { FiMoreVertical } from "react-icons/fi";

export default function SubjectFlashcardsPage({ subjectId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

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
    // 👇 IMPORTANT
    staleTime: 0, // always stale
    refetchOnMount: "always", // refetch when page opens
    refetchOnWindowFocus: true, // refetch when user comes back to tab
  });

  const currentCard = flashcards[currentIndex];
  /* ---------------- MUTATIONS ---------------- */

  const createMutation = useMutation({
    mutationFn: flashcardApi.create,
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
    mutationFn: ({ id, data }) => flashcardApi.update(id, data),
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

  const reviewMutation = useMutation({
    mutationFn: ({ id, isCorrect }) => flashcardApi.review(id, isCorrect),
    onSuccess: (response) => {
      refetch();
      handleNext();
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
    mutationFn: flashcardApi.delete,
    onSuccess: (response) => {
      setShowDeleteModal(false);
      setSelectedCard(null);
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

  /* ---------------- HELPERS ---------------- */

  const validate = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    } else if (formData.question.length < 20) {
      newErrors.question = "Question must be at least 20 characters";
    }
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    } else if (formData.answer.length < 20) {
      newErrors.answer = "Answer must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateModal = () => {
    setErrors({});
    setIsEditMode(false);
    setFormData({ question: "", answer: "", subject: subjectId });
    setShowModal(true);
  };

  const openEditModal = (card) => {
    setErrors({});
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

    if (!validate()) return;

    if (isEditMode) {
      updateMutation.mutate({ id: selectedCard._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
    setErrors({});
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

  const toggleCardSelection = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedCards([]);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedCards) {
      await deleteMutation.mutateAsync(id);
    }

    exitSelectionMode();
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdCardGiftcard}
        title="Flashcards"
        content="Learn faster with interactive flashcards"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Card
        </PrimaryButton>
      </PageHeader>

      {/* CONTENT */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : flashcards.length ? (
          <div className="space-y-8 p-1 sm:p-6">
            {/* FLASHCARD */}
            {!selectionMode && (
              <>
                {" "}
                <div
                  className="relative mx-auto cursor-pointer"
                  onClick={() => setIsFlipped((p) => !p)}
                >
                  <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-10 shadow-xl min-h-[260px] flex items-center justify-center">
                    <div className="text-center text-base-100">
                      <p className="text-sm opacity-80 mb-4">
                        {isFlipped ? "Answer" : "Question"} • {currentIndex + 1}{" "}
                        / {flashcards.length}
                      </p>
                      <p className="text-2xl font-semibold">
                        {isFlipped ? currentCard.answer : currentCard.question}
                      </p>

                      <p className="mt-6 text-xs opacity-60">Tap to flip</p>
                    </div>
                  </div>
                  <div
                    className="absolute top-4 right-4 dropdown dropdown-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="btn btn-circle btn-sm bg-primary/20 hover:bg-base-300">
                      <FiMoreVertical />
                    </button>

                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44">
                      <li>
                        <button
                          className="text-primary/80 hover:text-primary"
                          onClick={() => openEditModal(currentCard)}
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                      </li>

                      <li className="pb-1">
                        <button
                          className="text-error/80 hover:text-error"
                          onClick={() => {
                            setSelectedCard(currentCard);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </li>

                      <li className="border-t pt-1">
                        <button
                          className="text-primary/80 hover:text-primary"
                          onClick={() => {
                            setSelectionMode(true);
                            toggleCardSelection(currentCard._id);
                          }}
                        >
                          Select cards
                        </button>
                      </li>
                    </ul>
                  </div>
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
              </>
            )}
            {selectionMode && (
              <div className="space-y-4">
                {/* BULK BAR */}
                <div className="flex items-center justify-between rounded-2xl bg-warning/10 p-4">
                  <span className="text-sm font-medium">
                    {selectedCards.length} selected
                  </span>

                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={exitSelectionMode}>
                      Cancel
                    </button>

                    <button
                      className="btn btn-sm btn-error"
                      disabled={!selectedCards.length}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>

                {/* CARD GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flashcards.map((card) => (
                    <div
                      key={card._id}
                      className={`rounded-xl border bg-base-100 transition 
    ${selectedCards.includes(card._id) ? "ring-2 ring-primary" : ""}
  `}
                    >
                      <div className="flex items-center justify-between px-4 pt-4">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={selectedCards.includes(card._id)}
                          onChange={() => toggleCardSelection(card._id)}
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 pt-2">
                        <p className="font-semibold mb-2 line-clamp-2">
                          {card.question}
                        </p>
                        <p className="text-sm opacity-70 line-clamp-3">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            onChange={(e) => {
              setFormData({ ...formData, question: e.target.value }),
                setErrors({ ...errors, question: "" });
            }}
            required
            error={errors.question}
          />

          <FormInput
            label="Answer"
            type="textarea"
            placeholder="Enter the answer"
            value={formData.answer}
            onChange={(e) => {
              setFormData({ ...formData, answer: e.target.value }),
                setErrors({ ...errors, answer: "" });
            }}
            required
            error={errors.answer}
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
        title={
          selectedCards.length > 1 ? "Delete Flashcards" : "Delete Flashcard"
        }
        message={
          selectedCards.length > 1
            ? `Are you sure you want to delete ${selectedCards.length} flashcards?`
            : "Are you sure you want to delete this flashcard?"
        }
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={
          selectedCards.length > 1
            ? handleBulkDelete
            : () => deleteMutation.mutate(selectedCard._id)
        }
      />
    </div>
  );
}
