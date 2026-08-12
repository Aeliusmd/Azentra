"use client";

import { dismissFsToast, useFsToasts } from "@/lib/fs/toast-store";

/** Stacked confirmations under the topbar, on the right. */
export function FsToaster() {
  const toasts = useFsToasts();

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
          onClick={() => dismissFsToast(toast.id)}
          className="toast-pop pointer-events-auto rounded-2xl bg-[#111827] px-6 py-4 text-[17px] font-medium text-white shadow-lg"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
