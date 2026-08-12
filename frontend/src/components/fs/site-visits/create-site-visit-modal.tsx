"use client";

import { useState } from "react";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { SelectField } from "@/components/pm/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import { TextareaField } from "@/components/ui/textarea-field";
import {
  supervisedProperties,
  useSelectedFsProperty,
} from "@/lib/fs/properties";
import {
  VISIT_PURPOSES,
  type SiteVisitPurpose,
} from "@/lib/fs/site-visits-data";
import { addSiteVisit } from "@/lib/fs/site-visits-store";
import { showFsToast } from "@/lib/fs/toast-store";

const NO_TOWER = "Select...";

/** `14:30` from a native time input → `02:30 PM`, the format the data uses. */
function toDisplayTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const meridiem = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
}

/** Books a round for the supervisor on the property they are looking at. */
export function CreateSiteVisitModal({ onClose }: { onClose: () => void }) {
  const propertyId = useSelectedFsProperty();
  const buildings =
    supervisedProperties.find((property) => property.id === propertyId)
      ?.buildings ?? [];

  const [tower, setTower] = useState(NO_TOWER);
  const [floor, setFloor] = useState("");
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState<SiteVisitPurpose>(VISIT_PURPOSES[0]);
  const [participants, setParticipants] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const ready = location.trim() !== "" && date !== "" && time !== "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    const id = addSiteVisit({
      propertyId,
      building: tower === NO_TOWER ? "" : tower,
      floor: floor.trim(),
      location: location.trim(),
      purpose,
      participants: participants
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
      summary: summary.trim(),
      date,
      time: toDisplayTime(time),
    });

    showFsToast(`Site visit ${id} scheduled`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Create Site Visit" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="sv-tower"
              label="Tower"
              value={tower}
              onChange={setTower}
              options={[NO_TOWER, ...buildings]}
            />
            <InputField
              id="sv-floor"
              label="Floor"
              placeholder="e.g. 3 or All"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
            />
          </div>

          <InputField
            id="sv-location"
            label="Location"
            required
            placeholder="e.g. Tower A - Unit A-304"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="sv-type"
              label="Visit Type"
              value={purpose}
              onChange={(value) => setPurpose(value as SiteVisitPurpose)}
              options={VISIT_PURPOSES}
            />
            <InputField
              id="sv-participants"
              label="Participants"
              placeholder="Comma separated names"
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
            />
          </div>

          <TextareaField
            id="sv-purpose"
            label="Purpose"
            rows={3}
            placeholder="Describe the purpose of this site visit..."
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              id="sv-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <InputField
              id="sv-time"
              label="Time"
              type="time"
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <FsModalFooter
          onCancel={onClose}
          tone="amber"
          label="Create Site Visit"
          disabled={!ready}
        />
      </form>
    </Modal>
  );
}
