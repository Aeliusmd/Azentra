"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { SO_ID_TYPES, type SoIdType } from "@/lib/so/visitors-data";
import { registerSoVisitor } from "@/lib/so/visitors-store";

/**
 * The caller who turned up without a pass.
 *
 * A guard takes the details, and the visit joins the check-in queue cleared but
 * not admitted — registering somebody is not the same as opening the barrier,
 * and keeping them separate is what makes the gate log worth reading.
 */

const EMPTY = {
  name: "",
  phone: "",
  idNumber: "",
  resident: "",
  unit: "",
  purpose: "",
  plate: "",
};

export function SoRegisterVisitorTab({ propertyId }: { propertyId: string }) {
  const [form, setForm] = useState(EMPTY);
  const [idType, setIdType] = useState<SoIdType>(SO_ID_TYPES[0]);
  const [parking, setParking] = useState(false);

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    registerSoVisitor({
      propertyId,
      name: form.name,
      phone: form.phone,
      idType,
      idNumber: form.idNumber,
      resident: form.resident,
      unit: form.unit,
      purpose: form.purpose,
      // A bay is only logged where one was asked for, and a car needs a plate.
      vehicle: parking
        ? { type: "Vehicle", plate: form.plate.trim() || "Not recorded" }
        : null,
    });

    setForm(EMPTY);
    setIdType(SO_ID_TYPES[0]);
    setParking(false);
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[16px] font-bold text-ink">
        Manual Visitor Registration
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="so-visitor-name"
            label="Visitor Name"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
          />
          <InputField
            id="so-visitor-phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 555 ..."
            required
            value={form.phone}
            onChange={(event) => set("phone", event.target.value)}
          />

          <div>
            <FieldLabel htmlFor="so-visitor-id-type">ID Type</FieldLabel>
            <div className="relative">
              <select
                id="so-visitor-id-type"
                value={idType}
                onChange={(event) => setIdType(event.target.value as SoIdType)}
                className={`${controlClasses()} appearance-none py-3 pr-9 pl-3.5`}
              >
                {SO_ID_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <InputField
            id="so-visitor-id-number"
            label="ID Number"
            placeholder="ID number"
            required
            value={form.idNumber}
            onChange={(event) => set("idNumber", event.target.value)}
          />

          <InputField
            id="so-visitor-resident"
            label="Resident Name"
            placeholder="Host resident name"
            required
            value={form.resident}
            onChange={(event) => set("resident", event.target.value)}
          />
          <InputField
            id="so-visitor-unit"
            label="Unit Number"
            placeholder="e.g. A-1205"
            required
            value={form.unit}
            onChange={(event) => set("unit", event.target.value)}
          />
        </div>

        <InputField
          id="so-visitor-purpose"
          label="Purpose"
          placeholder="Purpose of visit"
          value={form.purpose}
          onChange={(event) => set("purpose", event.target.value)}
        />

        <div className="space-y-4">
          <Checkbox
            id="so-visitor-parking"
            label="Parking Required"
            checked={parking}
            onChange={(event) => setParking(event.target.checked)}
          />

          {/* The plate is only asked for once a bay is, so the form stays short
              for the many callers who arrive on foot. */}
          {parking && (
            <InputField
              id="so-visitor-plate"
              label="Vehicle Number"
              placeholder="e.g. TX-7AB-4421"
              value={form.plate}
              onChange={(event) => set("plate", event.target.value)}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#4a7fb5] px-6 py-3 text-[14px] font-semibold text-white sm:w-auto transition-colors hover:bg-[#3f6d9d] focus-visible:ring-2 focus-visible:ring-[#4a7fb5]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Register Visitor
        </button>
      </form>
    </Card>
  );
}
