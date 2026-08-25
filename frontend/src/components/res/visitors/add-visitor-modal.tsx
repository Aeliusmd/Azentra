"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { TODAY } from "@/lib/res/dashboard-data";
import { longDate, timeRange } from "@/lib/res/format";
import { showResToast } from "@/lib/res/toast-store";
import { VISIT_PURPOSES, windowEnd } from "@/lib/res/visitors-data";
import { registerVisitor } from "@/lib/res/visitors-store";

const CHECKBOX =
  "h-4 w-4 rounded border-gray-300 accent-[#2e6cad] focus-visible:ring-2 focus-visible:ring-brand/30";

/**
 * Pre-registering a visitor.
 *
 * One time is asked for, not two: the pass runs for a fixed window from the
 * arrival, which is shown back as soon as a time is picked so nobody is
 * surprised by when it lapses.
 */
export function AddVisitorModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [arriving, setArriving] = useState("");
  const [purpose, setPurpose] = useState<string>(VISIT_PURPOSES[0]);
  const [byVehicle, setByVehicle] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [parking, setParking] = useState(false);

  const ready =
    name.trim() !== "" && phone.trim() !== "" && date !== "" && arriving !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const pass = registerVisitor({
      name,
      phone,
      date,
      arriving,
      purpose,
      vehicle: byVehicle ? vehicle : null,
      parking: byVehicle && parking,
    });

    showResToast(`Pass ${pass.id} created for ${pass.name}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Visitor">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="vp-name" required>
              Visitor Name
            </FieldLabel>
            <input
              id="vp-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="vp-phone" required>
              Phone Number
            </FieldLabel>
            <input
              id="vp-phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="vp-date" required>
                Date
              </FieldLabel>
              <input
                id="vp-date"
                type="date"
                required
                min={TODAY}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="vp-time" required>
                Time
              </FieldLabel>
              <input
                id="vp-time"
                type="time"
                required
                value={arriving}
                onChange={(event) => setArriving(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          {arriving && (
            <p className="text-[13px] text-muted">
              The pass is valid {timeRange(arriving, windowEnd(arriving))}
              {date ? ` on ${longDate(date)}` : ""}.
            </p>
          )}

          <div>
            <FieldLabel htmlFor="vp-purpose">Purpose</FieldLabel>
            <select
              id="vp-purpose"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className={`${controlClasses()} px-3.5 py-3`}
            >
              {VISIT_PURPOSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={byVehicle}
                onChange={(event) => {
                  setByVehicle(event.target.checked);
                  // Parking only means anything with a vehicle behind it.
                  if (!event.target.checked) setParking(false);
                }}
                className={CHECKBOX}
              />
              <span className="text-[14px] text-ink">
                Visitor arriving by vehicle
              </span>
            </label>

            <div>
              <FieldLabel htmlFor="vp-vehicle">Vehicle Details</FieldLabel>
              <input
                id="vp-vehicle"
                value={vehicle}
                disabled={!byVehicle}
                onChange={(event) => setVehicle(event.target.value)}
                placeholder="e.g. Toyota Corolla - DEF 9012"
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>

            <label
              className={`flex items-center gap-2.5 ${byVehicle ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              <input
                type="checkbox"
                checked={parking}
                disabled={!byVehicle}
                onChange={(event) => setParking(event.target.checked)}
                className={CHECKBOX}
              />
              <span
                className={`text-[14px] ${byVehicle ? "text-ink" : "text-gray-400"}`}
              >
                Parking required
              </span>
            </label>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Visitor Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
