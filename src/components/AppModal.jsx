export default function AppModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-base-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] animate-scaleIn">
        <div className="border-b border-base-300 px-6 py-4">
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary rounded-t-3xl" />

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
