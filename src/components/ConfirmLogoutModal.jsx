import { PrimaryButton } from "./PrimaryButton";
import { FiLogOut } from "react-icons/fi";

export default function ConfirmLogoutModal({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-base-100 p-6 shadow-2xl animate-scale-in">
        {/* Glow */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-info to-error opacity-20 blur-xl rounded-t-3xl" />

        {/* Icon */}
        <div className="relative z-10 mx-auto -mt-16 flex h-20 w-20 items-center justify-center rounded-full bg-base-100 shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-info/20 ring-4 ring-info/30">
            <FiLogOut className="text-info text-2xl" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h3 className="text-xl font-bold text-info mt-3">Confirm Logout</h3>
          <p className="mt-2 text-sm text-base-content/70">
            You will be signed out of your account.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <PrimaryButton className="btn px-6" onClick={onCancel}>
            Cancel
          </PrimaryButton>

          <PrimaryButton
            className="btn bg-info hover:bg-info/90 text-info-content px-8 shadow-lg shadow-info/30"
            onClick={onConfirm}
            loading={loading}
          >
            Logout
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
