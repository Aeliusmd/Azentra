"use client";

import { useMemo, useState } from "react";

import { PmTaskModal } from "@/components/fs/preventive/pm-task-modal";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  byNextDate,
  checklistProgress,
  pmStatus,
  PM_STATUS_TONE,
  type PreventiveTask,
} from "@/lib/fs/preventive-data";
import { useFsPreventiveTasks } from "@/lib/fs/preventive-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";

/** Spans throughout: the whole card is one button, which only takes phrasing content. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <span className="block truncate text-[13px] text-muted">
      {label}: <span className="font-medium text-ink">{value}</span>
    </span>
  );
}

function TaskCard({
  task,
  onOpen,
}: {
  task: PreventiveTask;
  onOpen: () => void;
}) {
  const { done, total } = checklistProgress(task);
  const status = pmStatus(task);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Card className="h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex h-full w-full flex-col p-5 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-[17px] font-bold text-ink">
              {task.asset}
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-muted">
              {task.id} · {task.building} - {task.location}
            </span>
          </span>
          <Pill tone={PM_STATUS_TONE[status]}>{status}</Pill>
        </span>

        <span className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Field label="Frequency" value={task.frequency} />
          <Field label="Assigned" value={task.technician ?? "Unassigned"} />
          <Field label="Last Service" value={task.lastDone} />
          <Field label="Next Service" value={task.nextDate} />
        </span>

        <span className="mt-5 block">
          <span className="flex items-center justify-between gap-3 text-[13px]">
            <span className="text-muted">Checklist Progress</span>
            <span className="font-medium text-ink">
              {done}/{total}
            </span>
          </span>
          <span
            role="img"
            aria-label={`${done} of ${total} checks verified`}
            className="mt-2 block h-1.5 overflow-hidden rounded-full bg-gray-200"
          >
            <span
              className={`block h-full rounded-full transition-[width] ${
                percent === 100 ? "bg-[#3f9e63]" : "bg-brand"
              }`}
              style={{ width: `${percent}%` }}
            />
          </span>
        </span>
      </button>
    </Card>
  );
}

/**
 * Every recurring round on the site, soonest due first. The card is the round's
 * standing at a glance; opening one is where the supervisor verifies the work
 * and signs it off.
 */
export function FsPreventiveView() {
  const propertyId = useSelectedFsProperty();
  const tasks = useFsPreventiveTasks();

  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      tasks
        .filter((task) => task.propertyId === propertyId)
        .sort(byNextDate),
    [tasks, propertyId],
  );

  const openTask = tasks.find((task) => task.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Preventive Maintenance
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Manage and verify preventive maintenance execution
        </p>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No preventive rounds are set up for this property.
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} onOpen={() => setOpenId(task.id)} />
            </li>
          ))}
        </ul>
      )}

      {openTask && (
        <PmTaskModal task={openTask} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
