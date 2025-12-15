import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MdNotes } from "react-icons/md";
import { notesApi } from "../../api/notesApi";
import { subjectsApi } from "../../api/subjectsApi";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function NotesPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
  });

  /* ------------------ QUERIES ------------------ */

  const {
    data: notes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: notesApi.getAll,
    select: (res) => res.data?.data || [],
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    select: (res) => res.data?.data || [],
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
    setFormData({ title: "", content: "", subject: "" });
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
    setFormData({ title: "", content: "", subject: "" });
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

  /* ------------------ UI ------------------ */

  return (
    <div >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdNotes className="text-blue-600" /> Notes
          </h1>
          <p className="text-base-content/70">
            Create and manage your study notes
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          + New Note
        </button>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : notes.length ? (
        <div className="space-y-3 mt-6">
          {notes.map((note) => (
            <div key={note._id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="card-title">{note.title}</h2>
                    <p className="text-sm text-base-content/70">
                      {note.content?.slice(0, 120)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => openEditModal(note)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setSelectedNote(note);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    className="btn btn-xs btn-secondary"
                    onClick={() => summarizeMutation.mutate(note._id)}
                  >
                    Summarize
                  </button>

                  <button
                    className="btn btn-xs btn-accent"
                    onClick={() => flashcardMutation.mutate(note._id)}
                  >
                    Flashcards
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          No notes yet. Create your first note!
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {isEditMode ? "Update Note" : "Create Note"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input input-bordered w-full"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <textarea
                className="textarea textarea-bordered h-40 w-full"
                placeholder="Content..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
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
