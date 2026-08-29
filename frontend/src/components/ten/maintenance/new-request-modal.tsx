"use client";

import { useState } from "react";

import { TenPhotoDropzone } from "@/components/ten/ui/photo-dropzone";
import { showTenToast } from "@/components/ten/ui/toaster";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TODAY } from "@/lib/ten/dashboard-data";
import {
  PRIORITY_TEXT,
  REQUEST_CATEGORIES,
  REQUEST_PRIORITIES,
  type RequestCategory,
  type RequestPriority,
} from "@/lib/ten/maintenance-data";
import { submitTenRequest } from "@/lib/ten/maintenance-store";
import type { TenUpload } from "@/lib/ten/uploads";

const CONTROL = `${controlClasses()} px-3.5 py-3`;

/**
 * `HH:MM` off the wall clock, for the timeline's first stamp.
 *
 * Read in the submit handler rather than during render, so nothing about the
 * server's clock has to match the browser's.
 */
export function clockNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/**
 * Raising a maintenance request.
 *
 * The tenant says what is wrong; the property decides who comes and when. That
 * division is why there is no date picker here — nothing on this form can
 * promise a slot.
 */
export function NewRequestModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<RequestCategory>("Plumbing");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("Medium");
  const [photos, setPhotos] = useState<TenUpload[]>([]);

  const ready = description.trim() !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const request = submitTenRequest({
      category,
      description,
      priority,
      photos,
      today: TODAY,
      time: clockNow(),
    });

    showTenToast(`${request.id} submitted`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="New Maintenance Request">
      <form onSubmit={handleSubmit}>
        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="req-category" required>
              Category
            </FieldLabel>
            <select
              id="req-category"
              required
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as RequestCategory)
              }
              className={CONTROL}
            >
              {REQUEST_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="req-description" required>
              Description
            </FieldLabel>
            <textarea
              id="req-description"
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue in detail..."
              className={`${CONTROL} resize-y`}
            />
          </div>

          <fieldset>
            <legend className="mb-2 block text-[14px] font-medium text-ink">
              Priority
            </legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {REQUEST_PRIORITIES.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 text-[14px]"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option}
                    checked={priority === option}
                    onChange={() => setPriority(option)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className={`font-medium ${PRIORITY_TEXT[option]}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <FieldLabel htmlFor="req-photos">Upload Photos</FieldLabel>
            <TenPhotoDropzone
              id="req-photos"
              photos={photos}
              onChange={setPhotos}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-hairline px-5 py-5 sm:flex-row sm:px-8 sm:py-6">
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
            className="flex-1 rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
