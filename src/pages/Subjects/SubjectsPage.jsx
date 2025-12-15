import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { subjectsApi } from "../../api/subjectsApi";
import { MdBook } from "react-icons/md";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const {
    data: subjects = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectsApi.getAll(),
    select: (res) => res.data?.data || [],
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => subjectsApi.update(id, data),
    onSuccess: () => {
      closeModal();
      refetch();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => subjectsApi.delete(id),
    onSuccess: () => {
      setShowDeleteModal(false);
      setSelectedSubject(null);
      refetch();
    },
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubject(null);
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateMutation.mutate({
        id: selectedSubject._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdBook className="text-blue-600" /> Subjects
          </h1>
          <p className="text-base-content/70">Manage your study subjects</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Subject
        </button>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="card bg-base-200 shadow-md hover:shadow-lg"
            >
              <div className="card-body">
                <h2 className="card-title">{subject.name}</h2>
                <p className="text-sm text-base-content/70">
                  {subject.description}
                </p>

                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => openEditModal(subject)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => {
                      setSelectedSubject(subject);
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
      )}

      {/* CREATE / UPDATE MODAL */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {isEditMode ? "Update Subject" : "Create Subject"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input input-bordered w-full"
                placeholder="Subject name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

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
        title="Delete Subject"
        message={`Are you sure you want to delete "${selectedSubject?.name}"?`}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate(selectedSubject._id)}
      />
    </div>
  );
}
