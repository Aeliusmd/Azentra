"use client";

import { Modal } from "@/components/ui/modal";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="px-8 py-7">
        <p className="text-[15px] text-gray-600">{message}</p>
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
