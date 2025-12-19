import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { MdNotes, MdQuiz, MdStyle } from "react-icons/md";
import SubjectNotesPage from "./Tabs/NotesPage";
import SubjectFlashcardsPage from "./Tabs/FlashcardsPage";
import SubjectQuizzesPage from "./Tabs/QuizzesPage";
import { HiArrowLeft } from "react-icons/hi";

export default function SubjectDetailsPage() {
  const { subjectId } = useParams();
  const [activeTab, setActiveTab] = useState("notes");
  const navigate = useNavigate();
  const tabs = [
    { key: "notes", label: "Notes", icon: <MdNotes /> },
    { key: "quizzes", label: "Quizzes", icon: <MdQuiz /> },
    { key: "flashcards", label: "Flashcards", icon: <MdStyle /> },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="relative mb-6 flex items-center px-2">
        {/* Back Button (Left) */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 absolute left-[-10px] lg:left-0"
        >
          <HiArrowLeft className="text-lg" />
          <span className="hidden lg:inline">Back</span>
        </button>

        {/* Center Tabs */}
        <div className="mx-auto">
          <div className="tabs tabs-boxed flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn gap-2 ${
                  activeTab === tab.key ? "tab-active" : ""
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-h-[calc(80vh-35px)] sm:max-h-[calc(80vh-15px)] overflow-y-auto">
        {/* Content */}
        {activeTab === "notes" && <SubjectNotesPage subjectId={subjectId} />}
        {activeTab === "quizzes" && (
          <SubjectQuizzesPage subjectId={subjectId} />
        )}
        {activeTab === "flashcards" && (
          <SubjectFlashcardsPage subjectId={subjectId} />
        )}
      </div>
    </div>
  );
}
