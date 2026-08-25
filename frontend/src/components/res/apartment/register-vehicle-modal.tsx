"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { controlClasses, FieldLabel } from "@/components/ui/field";
import { registerVehicle } from "@/lib/res/apartment-store";
import { showResToast } from "@/lib/res/toast-store";

/** Sensible bounds for a model year, so a typo cannot become 202. */
const EARLIEST_YEAR = 1980;
const LATEST_YEAR = 2027;

/**
 * Adding a car to the unit.
 *
 * Nothing here touches the parking allocation: which bay this household holds
 * is the property's decision, so the form asks only about the vehicle.
 */
export function RegisterVehicleModal({ onClose }: { onClose: () => void }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");

  const yearNumber = Number(year);
  const yearValid =
    year !== "" &&
    Number.isInteger(yearNumber) &&
    yearNumber >= EARLIEST_YEAR &&
    yearNumber <= LATEST_YEAR;

  const ready =
    make.trim() !== "" && model.trim() !== "" && plate.trim() !== "" && yearValid;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const vehicle = registerVehicle({
      make,
      model,
      year: yearNumber,
      color,
      plate,
    });

    showResToast(`${vehicle.plate} registered — awaiting approval`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Register Vehicle">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-8">
          <div>
            <FieldLabel htmlFor="veh-make" required>
              Make
            </FieldLabel>
            <input
              id="veh-make"
              required
              value={make}
              onChange={(event) => setMake(event.target.value)}
              placeholder="e.g. Toyota"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="veh-model" required>
              Model
            </FieldLabel>
            <input
              id="veh-model"
              required
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder="e.g. Camry"
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="veh-year" required>
                Year
              </FieldLabel>
              <input
                id="veh-year"
                type="number"
                inputMode="numeric"
                required
                min={EARLIEST_YEAR}
                max={LATEST_YEAR}
                // Every year is a valid entry; a coarser step would have the
                // browser silently refuse perfectly ordinary ones.
                step={1}
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2024"
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="veh-color">Color</FieldLabel>
              <input
                id="veh-color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="e.g. Silver"
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="veh-plate" required>
              License Plate
            </FieldLabel>
            <input
              id="veh-plate"
              required
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
              placeholder="e.g. ABC 1234"
              className={`${controlClasses()} px-3.5 py-3 uppercase`}
            />
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6">
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-brand px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Register Vehicle
          </button>
        </div>
      </form>
    </Modal>
  );
}
