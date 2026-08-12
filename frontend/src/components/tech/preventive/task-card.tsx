"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { PhotoSlots } from "@/components/tech/ui/photo-slots";
import { Card } from "@/components/ui/card";
import { controlClasses } from "@/components/ui/field";
import {
  PM_STATUS_TONE,
  checklistProgress,
  type PreventiveTask,
} from "@/lib/tech/preventive-data";
import {
  removeTaskPhoto,
  setTaskNotes,
  setTaskPhoto,
  setTaskPhotoCaption,
  toggleChecklistItem,
} from "@/lib/tech/preventive-store";

export function TaskCard({
  task,
  onStart,
  onComplete,
}: {
  task: PreventiveTask;
  onStart: () => void;
  onComplete: () => void;
}) {
  const { done, total } = checklistProgress(task);
  const running = task.status === "In Progress";
  // Starting a task opens its checklist — that is the work.
  const [open, setOpen] = useState(false);
  const expanded = open || running;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-ink">{task.asset}</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {task.category} | {task.frequency}
          </p>
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            <span>Last: {task.lastService}</span>
            <span>Next: {task.nextService}</span>
          </p>
        </div>

        <Pill tone={PM_STATUS_TONE[task.status]}>{task.status}</Pill>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-hairline pt-4">
        <p className="text-[13px] text-muted">
          {done} / {total} completed
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={expanded}
          className="flex items-center gap-1.5 text-[13px] font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
        >
          {expanded ? "Hide Checklist" : "View Checklist"}
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-5">
          <ul className="space-y-2.5">
            {task.checklist.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={item.done}
                  disabled={!running}
                  onChange={() => toggleChecklistItem(task.id, item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-brand disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                />
                <label
                  htmlFor={item.id}
                  className={`text-[13px] select-none ${
                    item.done ? "text-gray-400 line-through" : "text-ink"
                  } ${running ? "" : "cursor-not-allowed"}`}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>

          {running && (
            <>
              <div>
                <label
                  htmlFor={`${task.id}-notes`}
                  className="mb-1.5 block text-[13px] font-semibold text-ink"
                >
                  Notes
                </label>
                <textarea
                  id={`${task.id}-notes`}
                  rows={3}
                  value={task.notes}
                  onChange={(event) =>
                    setTaskNotes(task.id, event.target.value)
                  }
                  placeholder="Readings, parts replaced, anything to flag..."
                  className={`${controlClasses()} resize-none px-3.5 py-2.5`}
                />
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-ink">
                  Photos
                </p>
                <PhotoSlots
                  photos={task.photos}
                  onPick={(slot, photo) => setTaskPhoto(task.id, slot, photo)}
                  onCaption={(slot, caption) =>
                    setTaskPhotoCaption(task.id, slot, caption)
                  }
                  onRemove={(slot) => removeTaskPhoto(task.id, slot)}
                />
              </div>
            </>
          )}
        </div>
      )}

      {task.status !== "Completed" && (
        <div className="mt-4">
          {running ? (
            <button
              type="button"
              onClick={onComplete}
              disabled={done < total}
              title={
                done < total ? "Tick every checklist item first" : undefined
              }
              className="rounded-md bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              Complete Task
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="rounded-md border border-hairline px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
            >
              Start Task
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
