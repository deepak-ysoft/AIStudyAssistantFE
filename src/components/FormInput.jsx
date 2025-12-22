import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

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
  const [showPassword, setShowPassword] = useState(false);

  const base =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed";

  const renderInput = () => {
    /* ---------- PASSWORD INPUT WITH EYE ---------- */
    if (type === "password") {
      return (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`${base} pr-12`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
            tabIndex={-1}
          >
            {showPassword ? (
              <MdVisibilityOff size={20} />
            ) : (
              <MdVisibility size={20} />
            )}
          </button>
        </div>
      );
    }

    /* ---------- OTHER TYPES ---------- */
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
