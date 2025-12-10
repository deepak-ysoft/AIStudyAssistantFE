import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notesApi } from '../../api/notesApi';

export default function NotesPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
  });

  const { data: notes = [], isLoading, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getAll(),
    select: (response) => response.data?.data || [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => notesApi.create(data),
    onSuccess: () => {
      setShowModal(false);
      setFormData({ title: '', content: '', subject: '' });
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
          <h1 className="text-3xl font-bold">📝 Notes</h1>
          <p className="text-base-content/70">Create and manage your study notes</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">Upload PDF</button>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Note
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="card-title">{note.title}</h2>
                      <p className="text-sm text-base-content/70 mt-2">
                        {note.content?.substring(0, 100)}...
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="badge">View</span>
                        <span className="badge badge-secondary">
                          Summarize
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost">Edit</button>
                      <button className="btn btn-sm btn-ghost text-error">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-lg">
              <p className="text-base-content/70 text-lg">
                No notes yet. Create your first note!
              </p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Create New Note</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title..."
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your notes here..."
                  className="textarea textarea-bordered h-40"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  placeholder="Select subject..."
                  className="input input-bordered"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
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
                  {createMutation.isPending ? 'Creating...' : 'Create'}
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
