"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

import { PHOTO_SLOTS, type Job, type PhotoSlot } from "@/lib/tech/jobs-data";
import {
  removeJobPhoto,
  setJobPhoto,
  setJobPhotoCaption,
} from "@/lib/tech/jobs-store";

/**
 * Before / During / After evidence. Frontend only — the picked file is previewed
 * from an object URL and never uploaded.
 */
function Slot({ job, slot }: { job: Job; slot: PhotoSlot }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const photo = job.photos[slot];

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={`${slot} photo`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setJobPhoto(job.id, slot, {
            url: URL.createObjectURL(file),
            name: file.name,
            caption: "",
          });
          // Let the same file be picked again after a remove.
          event.target.value = "";
        }}
      />

      {photo ? (
        <div className="overflow-hidden rounded-lg border border-hairline">
          <div className="relative">
            {/* Object URL of a local pick — next/image cannot optimise it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`${slot}: ${photo.name}`}
              className="h-[104px] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeJobPhoto(job.id, slot)}
              aria-label={`Remove ${slot} photo`}
              className="absolute top-1.5 right-1.5 rounded-full bg-gray-900/70 p-1 text-white transition-colors hover:bg-gray-900"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          <input
            value={photo.caption}
            onChange={(event) =>
              setJobPhotoCaption(job.id, slot, event.target.value)
            }
            placeholder="Add description..."
            aria-label={`${slot} photo description`}
            className="w-full border-t border-hairline px-2.5 py-2 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-[104px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
          <span className="text-[13px]">{slot}</span>
        </button>
      )}
    </div>
  );
}

export function PhotoSlots({ job }: { job: Job }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PHOTO_SLOTS.map((slot) => (
        <Slot key={slot} job={job} slot={slot} />
      ))}
    </div>
  );
}
