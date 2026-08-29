"use client";

import { useState } from "react";

import { showTenToast } from "@/components/ten/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { TODAY } from "@/lib/ten/dashboard-data";
import { createTenVisitorPass } from "@/lib/ten/visitors-store";

const CONTROL = `${controlClasses()} px-3.5 py-3`;

/**
 * Registering a visitor.
 *
 * The tenant says who is coming and whether they need a space; the property
 * allots the bay and Security decides who actually gets in. That division is
 * why this form has a *checkbox* for parking rather than a bay picker, and no
 * check-in control anywhere.
 */
export function AddVisitorModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(TODAY);
  const [time, setTime] = useState("14:00");
  const [purpose, setPurpose] = useState("");

  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [parkingRequired, setParkingRequired] = useState(false);

  const vehicleReady =
    !hasVehicle || (vehicleModel.trim() !== "" && vehiclePlate.trim() !== "");
  const ready =
    name.trim() !== "" && phone.trim() !== "" && date !== "" && time !== "" && vehicleReady;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const pass = createTenVisitorPass({
      name,
      phone,
      date,
      from: time,
      purpose,
      vehicle: hasVehicle
        ? {
            model: vehicleModel.trim(),
            plate: vehiclePlate.trim().toUpperCase(),
          }
        : null,
      parkingRequired,
    });

    showTenToast(`Pass ${pass.id} created for ${pass.name}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Visitor">
      <form onSubmit={handleSubmit}>
        <div className="max-h-[62vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="vis-name" required>
              Visitor Name
            </FieldLabel>
            <input
              id="vis-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className={CONTROL}
            />
          </div>

          <div>
            <FieldLabel htmlFor="vis-phone" required>
              Phone Number
            </FieldLabel>
            <input
              id="vis-phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 555..."
              className={CONTROL}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="vis-date" required>
                Date
              </FieldLabel>
              <input
                id="vis-date"
                type="date"
                required
                min={TODAY}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={CONTROL}
              />
            </div>
            <div>
              <FieldLabel htmlFor="vis-time" required>
                Time
              </FieldLabel>
              <input
                id="vis-time"
                type="time"
                required
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className={CONTROL}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="vis-purpose">Purpose of Visit</FieldLabel>
            <input
              id="vis-purpose"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              placeholder="e.g. Friend visit"
              className={CONTROL}
            />
          </div>

          <div className="space-y-3">
            <Checkbox
              id="vis-has-vehicle"
              label="Visitor has a vehicle"
              checked={hasVehicle}
              onChange={(event) => setHasVehicle(event.target.checked)}
            />

            {/* Revealed only once there is a car to describe. */}
            {hasVehicle && (
              <div className="grid grid-cols-1 gap-3 pl-6 sm:grid-cols-2">
                <input
                  aria-label="Vehicle make and model"
                  required
                  value={vehicleModel}
                  onChange={(event) => setVehicleModel(event.target.value)}
                  placeholder="e.g. Honda Civic"
                  className={`${controlClasses()} px-3.5 py-2.5`}
                />
                <input
                  aria-label="Vehicle plate number"
                  required
                  value={vehiclePlate}
                  onChange={(event) => setVehiclePlate(event.target.value)}
                  placeholder="e.g. JKL 3456"
                  className={`${controlClasses()} px-3.5 py-2.5 uppercase`}
                />
              </div>
            )}

            <Checkbox
              id="vis-parking"
              label="Parking required"
              checked={parkingRequired}
              onChange={(event) => setParkingRequired(event.target.checked)}
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
            className="flex-1 rounded-lg bg-violet-500 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-violet-600 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add Visitor
          </button>
        </div>
      </form>
    </Modal>
  );
}
