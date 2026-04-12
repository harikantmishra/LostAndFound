import { useCallback, useEffect, useState } from "react";
import { ToastContext } from "./toastContext";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((text, variant = "success") => {
    setToast({ text, variant });
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[100] w-[min(92vw,26rem)] -translate-x-1/2 rounded-3xl border px-5 py-4 text-sm font-semibold shadow-2xl backdrop-blur ${
            toast.variant === "error"
              ? "border-rose-200 bg-rose-50/95 text-rose-900"
              : "border-emerald-200 bg-white/95 text-slate-900"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </ToastContext.Provider>
  );
}
