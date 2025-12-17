export function PrimaryButton({
  children,
  onClick,
  className,
  loading,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading}
      onClick={onClick}
      className={
        className
          ? className
          : "btn btn-primary px-6 shadow-md hover:shadow-lg transition"
      }
    >
      {loading ? <span className="loading loading-spinner" /> : children}
    </button>
  );
}
