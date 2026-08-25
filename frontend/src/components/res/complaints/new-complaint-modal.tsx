"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

import { ResPhotoDropzone } from "@/components/res/ui/photo-dropzone";
import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import {
  COMPLAINT_CATEGORIES,
  type ComplaintCategory,
} from "@/lib/res/complaints-data";
import { submitComplaint } from "@/lib/res/complaints-store";
import { TODAY } from "@/lib/res/dashboard-data";
import { showResToast } from "@/lib/res/toast-store";
import type { ResUpload } from "@/lib/res/uploads";

/** The clock the mock portal raises a complaint at. */
const SUBMIT_TIME = "09:00";

/** Photos or a scan of something — a notice, a letter, a bill. */
const EVIDENCE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Raising a complaint.
 *
 * What it is about, what happened, and anything that backs it up. The property
 * manager decides where it goes from there, so the form asks nothing about
 * status or priority.
 */
export function NewComplaintModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<ComplaintCategory>("Noise");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<ResUpload[]>([]);

  const ready = description.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const complaint = submitComplaint({
      category,
      description,
      evidence,
      today: TODAY,
      time: SUBMIT_TIME,
    });

    showResToast(`Complaint ${complaint.id} submitted`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="New Complaint">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="cmp-category">Category</FieldLabel>
            <select
              id="cmp-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ComplaintCategory)
              }
              className={`${controlClasses()} px-3.5 py-3`}
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
              rows={4}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue in detail..."
              className={`${controlClasses()} resize-y px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="cmp-evidence">
              Attach Evidence (optional)
            </FieldLabel>
            <ResPhotoDropzone
              id="cmp-evidence"
              photos={evidence}
              onChange={setEvidence}
              icon={Camera}
              title="Upload photos or documents"
              hint=""
              accepted={EVIDENCE_TYPES}
            />
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-[#e8a33d] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#d18f2d] focus-visible:ring-2 focus-visible:ring-[#e8a33d]/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </Modal>
  );
}
