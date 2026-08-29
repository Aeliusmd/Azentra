"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { clockNow } from "@/components/ten/maintenance/new-request-modal";
import { TenPhotoDropzone } from "@/components/ten/ui/photo-dropzone";
import { showTenToast } from "@/components/ten/ui/toaster";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  COMPLAINT_CATEGORIES,
  type ComplaintCategory,
} from "@/lib/ten/complaints-data";
import { submitTenComplaint } from "@/lib/ten/complaints-store";
import { TODAY } from "@/lib/ten/dashboard-data";
import type { TenUpload } from "@/lib/ten/uploads";

const CONTROL = `${controlClasses()} px-3.5 py-3`;

/** Evidence can be a photo of the mess or a copy of a notice. */
const EVIDENCE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Raising a complaint.
 *
 * The tenant says what happened; the property decides what to do about it. That
 * is why there is no status or priority on this form — a complaint arrives as
 * `Submitted` and moves only when somebody has looked at it.
 */
export function NewComplaintModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<ComplaintCategory>("Noise");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<TenUpload[]>([]);

  const ready = description.trim() !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const complaint = submitTenComplaint({
      category,
      description,
      attachments,
      today: TODAY,
      time: clockNow(),
    });

    showTenToast(`${complaint.id} submitted`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="New Complaint">
      <form onSubmit={handleSubmit}>
        <div className="max-h-[62vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="cmp-category" required>
              Category
            </FieldLabel>
            <select
              id="cmp-category"
              required
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ComplaintCategory)
              }
              className={CONTROL}
            >
              {COMPLAINT_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="cmp-description" required>
              Description
            </FieldLabel>
            <textarea
              id="cmp-description"
              required
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your complaint in detail..."
              className={`${CONTROL} resize-y`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="cmp-evidence">
              Attach Evidence (optional)
            </FieldLabel>
            <TenPhotoDropzone
              id="cmp-evidence"
              photos={attachments}
              onChange={setAttachments}
              icon={ImagePlus}
              title="Upload photos or documents"
              hint="JPG, PNG or PDF up to 5MB"
              accepted={EVIDENCE_TYPES}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:px-8 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-hairline px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="flex-1 rounded-lg bg-rose-500 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </Modal>
  );
}
