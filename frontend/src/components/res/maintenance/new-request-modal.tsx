"use client";

import { useState } from "react";

import { ResPhotoDropzone } from "@/components/res/ui/photo-dropzone";
import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { TODAY } from "@/lib/res/dashboard-data";
import {
  PRIORITY_TEXT,
  REQUEST_CATEGORIES,
  REQUEST_PRIORITIES,
  type RequestCategory,
  type RequestPhoto,
  type RequestPriority,
} from "@/lib/res/maintenance-data";
import { submitResidentRequest } from "@/lib/res/maintenance-store";
import { showResToast } from "@/lib/res/toast-store";

/** The clock the mock portal raises a request at. */
const SUBMIT_TIME = "09:00";

/**
 * Raising a maintenance request.
 *
 * Four things only — what kind, what is wrong, how urgent, and photos. The
 * property sets the visit date and the technician once it has looked, so this
 * form does not ask a resident to guess at either.
 */
export function NewRequestModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<RequestCategory>("Plumbing");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("Medium");
  const [photos, setPhotos] = useState<RequestPhoto[]>([]);

  const ready = description.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const request = submitResidentRequest({
      category,
      description,
      priority,
      photos,
      today: TODAY,
      time: SUBMIT_TIME,
    });

    showResToast(`Request ${request.id} submitted`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="New Maintenance Request">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="mr-category">Category</FieldLabel>
            <select
              id="mr-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as RequestCategory)
              }
              className={`${controlClasses()} px-3.5 py-3`}
            >
              {REQUEST_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="mr-description" required>
              Description
            </FieldLabel>
            <textarea
              id="mr-description"
              rows={4}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue in detail..."
              className={`${controlClasses()} resize-y px-3.5 py-3`}
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-[13px] font-semibold text-ink">
              Priority
            </legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {REQUEST_PRIORITIES.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="mr-priority"
                    value={option}
                    checked={priority === option}
                    onChange={() => setPriority(option)}
                    className="h-4 w-4 accent-[#2e6cad]"
                  />
                  <span className={`text-[14px] ${PRIORITY_TEXT[option]}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <FieldLabel htmlFor="mr-photos">Upload Photos</FieldLabel>
            <ResPhotoDropzone
              id="mr-photos"
              photos={photos}
              onChange={setPhotos}
            />
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
