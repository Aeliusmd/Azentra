"use client";

import { dismissAccToast, useAccToasts } from "@/lib/acc/toast-store";

/** Stacked confirmations under the topbar, on the right. */
export function AccToaster() {
  const toasts = useAccToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-[92px] right-4 z-[60] flex flex-col items-end gap-2 sm:right-6"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissAccToast(toast.id)}
          className="toast-pop pointer-events-auto rounded-2xl bg-[#111827] px-6 py-4 text-[17px] font-medium text-white shadow-lg"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
