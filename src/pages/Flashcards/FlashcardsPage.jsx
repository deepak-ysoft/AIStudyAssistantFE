import { useState } from "react";
import { MdCardGiftcard } from "react-icons/md";

export default function FlashcardsPage() {
  const [flashcards] = useState([
    {
      id: 1,
      question: "What is photosynthesis?",
      answer: "Process of converting light energy into chemical energy",
    },
    {
      id: 2,
      question: "What is mitochondria?",
      answer: "Powerhouse of the cell",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdCardGiftcard className="text-blue-600" /> Flashcards
          </h1>
          <p className="text-base-content/70">
            Learn with interactive flashcards
          </p>
        </div>
        <button className="btn btn-primary">+ Create Set</button>
      </div>

      {flashcards.length > 0 ? (
        <div className="space-y-6">
          <div
            className="h-64 flex items-center justify-center cursor-pointer transition-all"
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
                    {isFlipped
                      ? flashcards[currentIndex].answer
                      : flashcards[currentIndex].question}
                  </p>
                  <p className="text-xs text-base-100/50 mt-4">Click to flip</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn btn-outline"
            >
              ← Previous
            </button>
            <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              />
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="btn btn-outline"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="btn btn-sm btn-ghost">Mark as Learned</button>
            <button className="btn btn-sm btn-ghost">Shuffle</button>
            <button className="btn btn-sm btn-ghost">Edit Set</button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <p className="text-base-content/70 text-lg">
            No flashcard sets yet. Create one to get started!
          </p>
        </div>
      )}
    </div>
  );
}
