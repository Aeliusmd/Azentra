"use client";

import { useState } from "react";

import { TYPE_ICON } from "@/components/pm/calendar/calendar-parts";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  PRIORITIES,
  TASK_TYPES,
  type CalendarEvent,
  type EventType,
  type Priority,
} from "@/lib/pm/calendar-data";

const PRIORITY_ACTIVE: Record<Priority, string> = {
  Low: "border-gray-300 bg-gray-50 text-ink",
  Medium: "border-amber-300 bg-amber-50 text-amber-700",
  High: "border-rose-300 bg-rose-50 text-rose-600",
};

/** Mounted only while open, so every field starts fresh on the current day. */
export function AddTaskModal({
  date,
  onClose,
  onSubmit,
}: {
  /** ISO date the calendar is currently sitting on. */
  date: string;
  onClose: () => void;
  onSubmit: (task: Omit<CalendarEvent, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(date);
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState<EventType>("Task");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      date: day,
      time,
      title: title.trim(),
      type,
      priority,
      description: description.trim() || undefined,
      status: type === "Task" || type === "Note" ? "Pending" : "Scheduled",
    });
  }

  return (
    <Modal open onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <div>
            <FieldLabel htmlFor="task-title" required>
              Title
            </FieldLabel>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title..."
              className={`${controlClasses()} px-3.5 py-3`}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="task-date">Date</FieldLabel>
              <input
                id="task-date"
                type="date"
                value={day}
                onChange={(event) => setDay(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="task-time">Time</FieldLabel>
              <input
                id="task-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className={`${controlClasses()} px-3.5 py-3`}
              />
            </div>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold text-ink">
              Type
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TASK_TYPES.map((option) => {
                const Icon = TYPE_ICON[option];
                const active = option === type;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setType(option)}
                    className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                      active
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-hairline text-muted hover:bg-gray-50"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold text-ink">
              Priority
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITIES.map((option) => {
                const active = option === priority;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPriority(option)}
                    className={`rounded-lg border px-3 py-3 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                      active
                        ? PRIORITY_ACTIVE[option]
                        : "border-hairline text-ink hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <FieldLabel htmlFor="task-description">
              Description (optional)
            </FieldLabel>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add any notes or details..."
              className={`${controlClasses()} resize-none px-3.5 py-3`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
