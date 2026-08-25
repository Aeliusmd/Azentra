"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, type LucideIcon } from "lucide-react";

import type { ResUpload } from "@/lib/res/uploads";

/**
 * Photo upload for the resident's forms.
 *
 * Frontend only: a picked file is previewed from an object URL and never
 * leaves the browser. The type and size are still checked, because a resident
 * who picks a 12MB HEIC off their phone should be told so here rather than
 * discover it when the request quietly arrives with nothing attached.
 */

const IMAGES = ["image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

/** What each accepted type is called when a file has to be turned away. */
const TYPE_NAMES: Record<string, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "application/pdf": "PDF",
};

let photoId = 0;

export function ResPhotoDropzone({
  photos,
  onChange,
  id = "photo-upload",
  icon: Icon = ImagePlus,
  title = "Click to upload or drag & drop",
  hint = "JPG, PNG up to 5MB",
  accepted = IMAGES,
}: {
  photos: ResUpload[];
  onChange: (photos: ResUpload[]) => void;
  id?: string;
  /** Glyph in the middle of the zone. */
  icon?: LucideIcon;
  title?: string;
  /** Second line under the title; omit for a single-line zone. */
  hint?: string;
  /** MIME types the zone will take. */
  accepted?: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  // Object URLs are a handle on memory; release them when this goes away.
  const urls = useRef<string[]>([]);
  useEffect(() => {
    const held = urls.current;
    return () => held.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function accept(files: FileList | null) {
    if (!files || files.length === 0) return;

    const picked: ResUpload[] = [];
    let rejected = "";

    for (const file of Array.from(files)) {
      if (!accepted.includes(file.type)) {
        const allowed = accepted
          .map((type) => TYPE_NAMES[type] ?? type)
          .join(" or ");
        rejected = `${file.name} is not a ${allowed}.`;
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejected = `${file.name} is over 5MB.`;
        continue;
      }

      const url = URL.createObjectURL(file);
      urls.current.push(url);
      picked.push({ id: `photo-${++photoId}`, name: file.name, url });
    }

    setError(rejected);
    if (picked.length > 0) onChange([...photos, ...picked]);
  }

  function remove(photo: ResUpload) {
    URL.revokeObjectURL(photo.url);
    urls.current = urls.current.filter((url) => url !== photo.url);
    onChange(photos.filter((entry) => entry.id !== photo.id));
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accepted.join(",")}
        multiple
        className="sr-only"
        onChange={(event) => {
          accept(event.target.files);
          // Lets the same file be picked again after being removed.
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
          dragging
            ? "border-brand bg-brand/5"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/70"
        }`}
      >
        <Icon aria-hidden="true" className="h-6 w-6 text-gray-400" />
        <span className="mt-2.5 text-[14px] text-muted">{title}</span>
        {hint && (
          <span className="mt-0.5 text-[13px] text-gray-400">{hint}</span>
        )}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-[13px] text-rose-600">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className="relative">
              {photo.name.toLowerCase().endsWith(".pdf") ? (
                <span className="flex h-[76px] w-full items-center justify-center rounded-lg border border-hairline bg-gray-50 px-2 text-center text-[11px] break-all text-gray-500">
                  {photo.name}
                </span>
              ) : (
                <>
                  {/* A local preview, so a plain img is right here. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-[76px] w-full rounded-lg border border-hairline object-cover"
                  />
                </>
              )}
              <button
                type="button"
                onClick={() => remove(photo)}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow ring-1 ring-hairline transition-colors hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only">Remove {photo.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
