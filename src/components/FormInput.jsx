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
  options = [], // for select / radio
}) {
  const base =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed";

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            className={`${base} min-h-[160px] resize-none`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );

      case "select":
        return (
          <select
            className={base}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-base-300 focus:ring-primary"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
          />
        );

      case "radio":
        return (
          <div className="flex gap-4">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={onChange}
                  disabled={disabled}
                  className="radio radio-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={onChange}
            required={required}
            disabled={disabled}
          />
        );

      default:
        return (
          <input
            type={type}
            className={className ? className : base}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className={`space-y-1.5 ${containerClassName || ""}`}>
      {label && (
        <label className="text-sm font-medium text-base-content/80">
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
}
