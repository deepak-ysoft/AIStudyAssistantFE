import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  options = [], // select / radio
  className = "",
  containerClassName = "",

  /* ---- validation props ---- */
  error,
  pattern,
  minLength,
  maxLength,
  min,
  max,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const base =
    "w-full rounded-xl border bg-base-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const borderClass = error
    ? "border-error focus:ring-error/40"
    : "border-base-300 focus:ring-primary/40";

  const commonProps = {
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    disabled,
    pattern,
    minLength,
    maxLength,
    min,
    max,
  };

  const renderInput = () => {
    /* ---------- PASSWORD ---------- */
    if (type === "password") {
      return (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`${base} ${borderClass} pr-12 ${className}`}
            {...commonProps}
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

    /* ---------- TEXTAREA ---------- */
    if (type === "textarea") {
      return (
        <textarea
          className={`${base} ${borderClass} min-h-[120px] resize-none ${className}`}
          {...commonProps}
        />
      );
    }

    /* ---------- SELECT ---------- */
    if (type === "select") {
      return (
        <select
          className={`${base} ${borderClass} ${className}`}
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
    }

    /* ---------- CHECKBOX ---------- */
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-5 w-5 rounded border-base-300 focus:ring-primary"
        />
      );
    }

    /* ---------- RADIO ---------- */
    if (type === "radio") {
      return (
        <div className="flex gap-4">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
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
    }

    /* ---------- FILE ---------- */
    if (type === "file") {
      return (
        <input
          type="file"
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="file-input file-input-bordered w-full"
        />
      );
    }

    /* ---------- DEFAULT (text, email, number, etc.) ---------- */
    return (
      <input
        type={type}
        className={`${base} ${borderClass} ${className}`}
        {...commonProps}
      />
    );
  };

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-base-content/80">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
