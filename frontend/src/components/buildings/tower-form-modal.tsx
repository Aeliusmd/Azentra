"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import type { Tower } from "@/lib/buildings-data";

export const AMENITY_OPTIONS = [
  "Elevator",
  "Gym",
  "Pool",
  "Parking",
  "Garden",
  "Playground",
];

export type TowerFormValues = {
  name: string;
  floors: string;
  unitsPerFloor: string;
  amenities: string[];
  status: Tower["status"];
};

type Errors = Partial<Record<"name" | "floors" | "unitsPerFloor", string>>;

const CONTROL =
  "w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-ink " +
  "placeholder:text-gray-400 outline-none transition-colors focus:ring-2";
const CONTROL_IDLE = "border-hairline focus:border-brand focus:ring-brand/20";
const CONTROL_INVALID = "border-red-300 focus:border-red-400 focus:ring-red-100";

function control(hasError?: boolean) {
  return `${CONTROL} ${hasError ? CONTROL_INVALID : CONTROL_IDLE}`;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[15px] text-ink">
      {children}
    </label>
  );
}

function Error({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-600">
      {message}
    </p>
  );
}

/**
 * Add and edit share this form — `tower` decides which. Mount it with a `key`
 * tied to the record so each open starts from fresh state.
 */
export function TowerFormModal({
  tower,
  onClose,
  onSubmit,
}: {
  tower: Tower | null;
  onClose: () => void;
  onSubmit: (values: TowerFormValues) => void;
}) {
  const editing = tower !== null;

  const [values, setValues] = useState<TowerFormValues>({
    name: tower?.name ?? "",
    floors: String(tower?.floors ?? 10),
    // Existing towers store totals, not a per-floor figure.
    unitsPerFloor: tower
      ? String(Math.max(1, Math.round(tower.totalUnits / tower.floors)))
      : "4",
    amenities: tower?.amenities ?? [],
    status: tower?.status ?? "active",
  });
  const [errors, setErrors] = useState<Errors>({});

  // Amenities the tower already has that aren't in the standard list, plus any
  // added during this session.
  const [customAmenities, setCustomAmenities] = useState<string[]>(() =>
    (tower?.amenities ?? []).filter(
      (amenity) => !AMENITY_OPTIONS.includes(amenity),
    ),
  );
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [amenityError, setAmenityError] = useState<string | null>(null);
  const newAmenityRef = useRef<HTMLInputElement>(null);

  const amenityOptions = [...AMENITY_OPTIONS, ...customAmenities];

  useEffect(() => {
    if (addingAmenity) newAmenityRef.current?.focus();
  }, [addingAmenity]);

  function closeAmenityInput() {
    setAddingAmenity(false);
    setNewAmenity("");
    setAmenityError(null);
  }

  function commitAmenity() {
    const value = newAmenity.trim();
    if (!value) {
      setAmenityError("Enter an amenity name.");
      return;
    }

    const existing = amenityOptions.find(
      (amenity) => amenity.toLowerCase() === value.toLowerCase(),
    );

    if (existing) {
      // Already offered — just tick it rather than creating a duplicate.
      if (!values.amenities.includes(existing)) toggleAmenity(existing);
      setNewAmenity("");
      setAmenityError(null);
      return;
    }

    setCustomAmenities((current) => [...current, value]);
    setValues((current) => ({
      ...current,
      amenities: [...current.amenities, value],
    }));
    setNewAmenity("");
    setAmenityError(null);
  }

  function update<K extends keyof TowerFormValues>(
    field: K,
    value: TowerFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleAmenity(amenity: string) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Tower name is required.";

    const floors = Number(values.floors);
    if (!Number.isInteger(floors) || floors < 1)
      next.floors = "Enter a whole number of floors (1 or more).";

    const perFloor = Number(values.unitsPerFloor);
    if (!Number.isInteger(perFloor) || perFloor < 1)
      next.unitsPerFloor = "Enter a whole number of units (1 or more).";

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
      title={editing ? "Edit Tower" : "Add New Tower"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 px-8 py-7">
          <div>
            <Label htmlFor="tower-name">Tower Name</Label>
            <input
              id="tower-name"
              placeholder="e.g. Tower D"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "tower-name-error" : undefined}
              className={control(!!errors.name)}
            />
            <Error id="tower-name-error" message={errors.name} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="tower-floors">Number of Floors</Label>
              <input
                id="tower-floors"
                type="number"
                min={1}
                value={values.floors}
                onChange={(event) => update("floors", event.target.value)}
                aria-invalid={errors.floors ? true : undefined}
                aria-describedby={
                  errors.floors ? "tower-floors-error" : undefined
                }
                className={control(!!errors.floors)}
              />
              <Error id="tower-floors-error" message={errors.floors} />
            </div>

            <div>
              <Label htmlFor="tower-units">Units per Floor</Label>
              <input
                id="tower-units"
                type="number"
                min={1}
                value={values.unitsPerFloor}
                onChange={(event) => update("unitsPerFloor", event.target.value)}
                aria-invalid={errors.unitsPerFloor ? true : undefined}
                aria-describedby={
                  errors.unitsPerFloor ? "tower-units-error" : undefined
                }
                className={control(!!errors.unitsPerFloor)}
              />
              <Error id="tower-units-error" message={errors.unitsPerFloor} />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-[15px] text-ink">Amenities</legend>
            <div className="flex flex-wrap items-center gap-3">
              {amenityOptions.map((amenity) => {
                const checked = values.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md px-3.5 py-2.5 text-[14px] transition-colors ${
                      checked
                        ? "bg-brand/10 text-brand-dark ring-1 ring-brand/30"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 accent-brand"
                    />
                    {amenity}
                  </label>
                );
              })}

              {!addingAmenity && (
                <button
                  type="button"
                  onClick={() => setAddingAmenity(true)}
                  aria-label="Add another amenity"
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>

            {addingAmenity && (
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={newAmenityRef}
                    value={newAmenity}
                    aria-label="New amenity name"
                    placeholder="e.g. Rooftop Lounge"
                    onChange={(event) => {
                      setNewAmenity(event.target.value);
                      setAmenityError(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        // Don't let Enter submit the tower form.
                        event.preventDefault();
                        commitAmenity();
                      } else if (event.key === "Escape") {
                        // Close just this field, not the whole modal.
                        event.stopPropagation();
                        closeAmenityInput();
                      }
                    }}
                    className={`${control(!!amenityError)} h-[42px] w-auto flex-1 py-0 text-[14px]`}
                  />
                  <button
                    type="button"
                    onClick={commitAmenity}
                    className="h-[42px] rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={closeAmenityInput}
                    className="h-[42px] rounded-md border border-hairline px-4 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                  >
                    Done
                  </button>
                </div>
                <Error id="new-amenity-error" message={amenityError ?? undefined} />
              </div>
            )}
          </fieldset>

          <div className="sm:w-1/2 sm:pr-3">
            <Label htmlFor="tower-status">Status</Label>
            <select
              id="tower-status"
              value={values.status}
              onChange={(event) =>
                update("status", event.target.value as Tower["status"])
              }
              className={control()}
            >
              <option value="active">Active</option>
              <option value="under construction">Under Construction</option>
            </select>
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
            {editing ? "Update Tower" : "Add Tower"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
