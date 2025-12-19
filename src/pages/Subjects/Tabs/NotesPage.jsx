import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdNotes } from "react-icons/md";
import { notesApi } from "../../../api/notesApi";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AppModal from "../../../components/AppModal";
import FormInput from "../../../components/FormInput";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { TbCards, TbPaperclip } from "react-icons/tb";
import PageHeader from "../../../components/PageHeader";

export default function SubjectNotesPage({ subjectId }) {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsNote, setDetailsNote] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: subjectId,
  });

  /* ------------------ QUERIES ------------------ */

  const {
    data: notes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notes", subjectId],
    queryFn: () => notesApi.getAll({ subject: subjectId }),
    select: (res) => res.data?.data || [],
    enabled: !!subjectId,
  });

  /* ------------------ MUTATIONS ------------------ */

  const createMutation = useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => notesApi.update(id, data),
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notesApi.delete,
    onSuccess: () => {
      setShowDeleteModal(false);
      setSelectedNote(null);
      refetch();
    },
  });

  const summarizeMutation = useMutation({
    mutationFn: notesApi.generateSummary,
    onSuccess: (res) => {
      alert("Summary generated successfully");
      refetch();
    },
  });

  const flashcardMutation = useMutation({
    mutationFn: notesApi.generateFlashcards,
    onSuccess: () => {
      alert("Flashcards generated successfully");
    },
  });

  /* ------------------ HELPERS ------------------ */

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ title: "", content: "", subject: subjectId });
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setIsEditMode(true);
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      subject: note.subject?._id || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedNote(null);
    setFormData({ title: "", content: "", subject: subjectId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateMutation.mutate({
        id: selectedNote._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openDetailsModal = (note) => {
    setDetailsNote(note);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsNote(null);
  };

  /* ------------------ UI ------------------ */

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdNotes}
        title="Notes"
        content="Capture ideas, summarize knowledge, and generate flashcards
              instantly"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Note
        </PrimaryButton>
      </PageHeader>
      {/* LIST */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : notes.length ? (
          <div
            className={`${
              notes.length === 1
                ? "grid grid-cols-1"
                : "grid grid-cols-1 md:grid-cols-2 "
            }gap-4 p-1 sm:p-6`}
          >
            {notes.map((note) => (
              <div
                key={note._id}
                className="group relative overflow-hidden rounded-3xl bg-base-100 shadow-lg transition-all hover:shadow-xl"
              >
                {/* Accent bar */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />

                <div className="p-6 pl-8">
                  <h2 className="text-xl font-semibold flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                    {/* Title */}
                    <span className="order-2 xl:order-1">{note.title}</span>

                    {/* Actions */}
                    <div className="order-1 xl:order-2 flex gap-3 transition">
                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={() => openEditModal(note)}
                      >
                        <FiEdit2 className="text-primary" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={() => openDetailsModal(note)}
                      >
                        <FiEye className="text-info" size={16} />
                      </button>

                      <button
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                        onClick={() => {
                          setSelectedNote(note);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 className="text-error" size={16} />
                      </button>
                    </div>
                  </h2>

                  <p className="text-sm pt-5 text-base-content/70 line-clamp-4">
                    {note.content}
                  </p>

                  {/* Action bar */}
                  <div className="mt-6 flex gap-2">
                    <button
                      className="btn btn-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={() => summarizeMutation.mutate(note._id)}
                    >
                      <HiOutlineSparkles size={16} />
                      <span className="hidden lg:inline"> Summarize</span>
                    </button>

                    <button
                      className="btn btn-sm rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20"
                      onClick={() => flashcardMutation.mutate(note._id)}
                    >
                      <TbCards size={16} />
                      <span className="hidden lg:inline"> Flashcards</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center py-32 text-center h-[calc(60vh-60px)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl" />

            <MdNotes className="text-6xl text-primary/60 mb-4 z-10" />
            <h3 className="text-2xl font-semibold z-10">
              Start building your knowledge
            </h3>
            <p className="text-base-content/70 mt-2 max-w-md z-10">
              Create notes, generate summaries, and turn them into flashcards
              automatically
            </p>

            <button
              onClick={openCreateModal}
              className="btn btn-primary rounded-full mt-6 z-10"
            >
              Create your first note
            </button>
          </div>
        )}
      </div>
      {/* CREATE / EDIT MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Update Note" : "Create Note"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Title"
            placeholder="Give your note a title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <FormInput
            label="Content"
            type="textarea"
            placeholder="Write something meaningful..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn " onClick={closeModal}>
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? "Update Note" : "Create Note"}
            </PrimaryButton>
          </div>
        </form>
      </AppModal>
      {/* Details Modal */}
      <AppModal
        open={showDetailsModal}
        title="Note Details"
        onClose={closeDetailsModal}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{detailsNote?.title}</h2>
          </div>

          <div className="rounded-2xl bg-primary/35 p-5 max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {detailsNote?.content}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button className="btn " onClick={closeDetailsModal}>
              Close
            </button>
          </div>
        </div>
      </AppModal>
      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Note"
        message={`Are you sure you want to delete "${selectedNote?.title}"?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedNote._id)}
      />
    </div>
  );
}
