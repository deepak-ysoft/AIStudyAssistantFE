import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { subjectsApi } from "../../api/subjectsApi";
import { MdBook } from "react-icons/md";

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const {
    data: subjects = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectsApi.getAll(),
    select: (response) => response.data?.data || [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => subjectsApi.create(data),
    onSuccess: () => {
      setShowModal(false);
      setFormData({ name: "", description: "" });
      refetch();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MdBook className="text-blue-600" /> Subjects
          </h1>
          <p className="text-base-content/70">Manage your study subjects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Subject
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div
                key={subject._id}
                className="card bg-base-200 shadow-md hover:shadow-lg transition"
              >
                <div className="card-body">
                  <h2 className="card-title">{subject.name}</h2>
                  <p className="text-sm text-base-content/70">
                    {subject.description}
                  </p>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-ghost">View</button>
                    <button className="btn btn-sm btn-ghost text-error">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-base-content/70 text-lg">
                No subjects yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Subject</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Biology"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Subject description..."
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
