import { PrimaryButton } from "./PrimaryButton";

export default function ConfirmDeleteModal({
  open,
  title = "Delete",
  message = "Are you sure?",
  confirmText = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">{title}</h3>
        <p className="py-4">{message}</p>

        <div className="modal-action">
          <PrimaryButton className="btn" onClick={onCancel}>
            Cancel
          </PrimaryButton>
          <PrimaryButton
            className="btn bg-secondary/80  hover:bg-secondary px-7"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </PrimaryButton>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel} />
    </div>
  );
}
