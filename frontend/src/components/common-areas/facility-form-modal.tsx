"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { FacilityImage } from "@/components/common-areas/facility-visuals";
import { Modal } from "@/components/ui/modal";
import {
  FACILITY_CATEGORIES,
  type Facility,
  type FacilityCategory,
} from "@/lib/common-areas-data";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export type FacilityFormValues = {
  name: string;
  category: FacilityCategory;
  location: string;
  capacity: string;
  hours: string;
  bookingRequired: boolean;
  description: string;
  image: string;
};

type Errors = Partial<
  Record<"name" | "location" | "capacity" | "hours" | "image", string>
>;

const CONTROL =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink " +
  "placeholder:text-gray-400 outline-none transition-colors focus:ring-2";
const IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

function control(hasError?: boolean) {
  return `${CONTROL} ${hasError ? INVALID : IDLE}`;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] text-ink">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

export function FacilityFormModal({
  facility,
  onClose,
  onSubmit,
}: {
  facility: Facility | null;
  onClose: () => void;
  onSubmit: (values: FacilityFormValues) => void;
}) {
  const editing = facility !== null;
  const fileRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FacilityFormValues>({
    name: facility?.name ?? "",
    category: facility?.category ?? "Recreation",
    location: facility?.location ?? "",
    capacity: facility ? String(facility.capacity) : "",
    hours: facility?.hours ?? "",
    bookingRequired: facility?.bookingRequired ?? false,
    description: facility?.description ?? "",
    image: facility?.image ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [dragging, setDragging] = useState(false);

  function update<K extends keyof FacilityFormValues>(
    field: K,
    value: FacilityFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function acceptFile(file: File | undefined) {
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "Use a JPG, PNG or WebP image.",
      }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((current) => ({
        ...current,
        image: "Image must be 5MB or smaller.",
      }));
      return;
    }

    // Read as a data URL so the preview survives re-renders without any
    // object-URL lifecycle to manage.
    const reader = new FileReader();
    reader.onload = () => update("image", String(reader.result));
    reader.readAsDataURL(file);
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Facility name is required.";
    if (!values.location.trim()) next.location = "Location is required.";
    if (!values.hours.trim()) next.hours = "Operating hours are required.";

    const capacity = Number(values.capacity);
    if (!values.capacity.trim() || !Number.isInteger(capacity) || capacity < 1)
      next.capacity = "Enter a whole number of people (1 or more).";

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(values);
  }

  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={editing ? "Edit Facility" : "Add New Facility"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5 px-8 py-6">
          <div>
            <p className="mb-1.5 text-[13px] text-ink">Facility Image</p>

            {values.image ? (
              <div className="relative h-[150px] overflow-hidden rounded-lg border border-hairline">
                <FacilityImage
                  src={values.image}
                  alt={values.name || "Facility preview"}
                />
                <button
                  type="button"
                  onClick={() => update("image", "")}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  acceptFile(event.dataTransfer.files[0]);
                }}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-9 text-center transition-colors ${
                  dragging
                    ? "border-brand bg-brand/5"
                    : errors.image
                      ? "border-red-300"
                      : "border-gray-300"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <ImagePlus aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[13px] text-gray-600">
                  Drop your image here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="font-semibold text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  Supports JPG, PNG, WebP — max 5MB
                </p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="hidden"
              onChange={(event) => {
                acceptFile(event.target.files?.[0]);
                // Allow re-picking the same file after removing it.
                event.target.value = "";
              }}
            />
            <FieldError message={errors.image} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="facility-name">Facility Name</Label>
              <input
                id="facility-name"
                placeholder="e.g. Yoga Room"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                className={control(!!errors.name)}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="facility-category">Category</Label>
              <select
                id="facility-category"
                value={values.category}
                onChange={(event) =>
                  update("category", event.target.value as FacilityCategory)
                }
                className={control()}
              >
                {FACILITY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="facility-location">Location</Label>
            <input
              id="facility-location"
              placeholder="e.g. Ground Floor, Tower A"
              value={values.location}
              onChange={(event) => update("location", event.target.value)}
              className={control(!!errors.location)}
            />
            <FieldError message={errors.location} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="facility-capacity">Capacity</Label>
              <input
                id="facility-capacity"
                type="number"
                min={1}
                placeholder="e.g. 30"
                value={values.capacity}
                onChange={(event) => update("capacity", event.target.value)}
                className={control(!!errors.capacity)}
              />
              <FieldError message={errors.capacity} />
            </div>

            <div>
              <Label htmlFor="facility-hours">Operating Hours</Label>
              <input
                id="facility-hours"
                placeholder="e.g. 6:00 AM - 9:00 PM"
                value={values.hours}
                onChange={(event) => update("hours", event.target.value)}
                className={control(!!errors.hours)}
              />
              <FieldError message={errors.hours} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="facility-booking"
              type="checkbox"
              checked={values.bookingRequired}
              onChange={(event) =>
                update("bookingRequired", event.target.checked)
              }
              className="h-4 w-4 accent-brand"
            />
            <label
              htmlFor="facility-booking"
              className="text-[13px] text-ink select-none"
            >
              Booking Required
            </label>
          </div>

          <div>
            <Label htmlFor="facility-description">Description</Label>
            <textarea
              id="facility-description"
              rows={3}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              className={`${control()} resize-none`}
            />
          </div>
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
            type="submit"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {editing ? "Update Facility" : "Add Facility"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
