import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`rounded-lg px-4 py-3 shadow-lg text-white flex items-center gap-2
      ${
        toast.type === "success"
          ? "bg-primary"
          : toast.type === "error"
          ? "bg-error"
          : toast.type === "warning"
          ? "bg-warning text-black"
          : "bg-info"
      }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
