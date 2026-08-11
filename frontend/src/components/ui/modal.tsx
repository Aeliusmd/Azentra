"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const SIZES = {
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
} as const;

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Secondary line under the title, e.g. the record this dialog is about. */
  subtitle?: string;
  size?: keyof typeof SIZES;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // Keep focus inside the dialog.
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/50 p-4"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`my-auto w-full overflow-hidden rounded-2xl bg-white shadow-xl ${SIZES[size]}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-8 py-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-[22px] font-bold text-ink">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
