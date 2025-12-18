import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { subjectsApi } from "../../api/subjectsApi";
import { MdBook } from "react-icons/md";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/PrimaryButton";
import AppModal from "../../components/AppModal";
import FormInput from "../../components/FormInput";
import PageHeader from "../../components/PageHeader";

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  /* ---------------- QUERY ---------------- */

  const {
    data: subjects = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    select: (res) => res.data?.data || [],
  });

  /* ---------------- MUTATIONS ---------------- */

  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectsApi.update(id, data),
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: () => {
      setShowDeleteModal(false);
      setSelectedSubject(null);
      refetch();
    },
  });

  /* ---------------- HELPERS ---------------- */

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setFormData({ name: subject.name, description: subject.description });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedSubject(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      updateMutation.mutate({ id: selectedSubject._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdBook}
        title="Subjects"
        content="Organize your learning into focused subjects"
      >
        <PrimaryButton
          onClick={openCreateModal}
          className="btn btn-primary px-6 shadow-lg hover:scale-[1.03] transition"
        >
          + New Subject
        </PrimaryButton>
      </PageHeader>
      {/* LIST */}
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-2 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : subjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-2 sm:m-5 gap-6 ">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="group relative overflow-hidden rounded-3xl bg-base-100 shadow-lg transition-all hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/subjects/${subject._id}`)}
              >
                {/* Accent bar */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary" />

                <div className="p-6 pl-8">
                  <h2 className="text-xl font-semibold flex justify-between items-start">
                    {subject.name}

                    <div className="flex gap-2 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(subject);
                        }}
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                      >
                        <FiEdit2 className="text-primary" size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubject(subject);
                          setShowDeleteModal(true);
                        }}
                        className="btn btn-circle btn-sm bg-primary/35 hover:bg-base-300"
                      >
                        <FiTrash2 className="text-error" size={16} />
                      </button>
                    </div>
                  </h2>

                  <p className="mt-3 text-sm text-base-content/70 line-clamp-3">
                    {subject.description || "No description provided"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center py-32 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl" />

            <MdBook className="text-6xl text-primary/60 mb-4 z-10" />
            <h3 className="text-2xl font-semibold z-10">No subjects yet</h3>
            <p className="text-base-content/70 mt-2 max-w-md z-10">
              Create subjects to organize notes, quizzes, and flashcards
            </p>

            <button
              onClick={openCreateModal}
              className="btn btn-primary rounded-full mt-6 z-10"
            >
              Create your first subject
            </button>
          </div>
        )}
      </div>
      {/* CREATE / UPDATE MODAL */}
      <AppModal
        open={showModal}
        title={isEditMode ? "Update Subject" : "Create Subject"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Name"
            placeholder="Subject name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FormInput
            label="Description"
            type="textarea"
            placeholder="Short description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

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
              {isEditMode ? "Update Subject" : "Create Subject"}
            </PrimaryButton>
          </div>
        </form>
      </AppModal>

      {/* DELETE CONFIRM */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete Subject"
        message={`Are you sure you want to delete \"${selectedSubject?.name}\"?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedSubject._id)}
      />
    </div>
  );
}
