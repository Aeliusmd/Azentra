"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import { addTechnicianFeedback } from "@/lib/fs/technician-feedback-store";
import { showFsToast } from "@/lib/fs/toast-store";
import type { FsTechnician } from "@/lib/fs/technicians-data";

/** A private note on how someone is doing — kept off the technician's record. */
export function FeedbackModal({
  technician,
  onClose,
}: {
  technician: FsTechnician;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;

    addTechnicianFeedback(technician.id, text.trim());
    showFsToast(`Feedback saved for ${technician.name}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Feedback — ${technician.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 px-8 py-7">
          <p className="text-[15px] text-muted">
            Internal management feedback for {technician.name}. Not shared with
            the technician.
          </p>

          <TextareaField
            id="tf-text"
            label="Feedback"
            rows={4}
            placeholder="Strengths, gaps, and anything to follow up on..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        <FsModalFooter
          onCancel={onClose}
          label="Save Feedback"
          disabled={!text.trim()}
        />
      </form>
    </Modal>
  );
}
