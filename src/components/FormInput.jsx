export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  className,
  containerClassName,
  placeholder,
  required,
  disabled,
}) {
  const base =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className={`space-y-1.5 ${containerClassName || ""}`}>
      {label && (
        <label className="text-sm font-medium text-base-content/80">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          className={`${base} min-h-[160px] resize-none`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className={className ? className : base}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
}
