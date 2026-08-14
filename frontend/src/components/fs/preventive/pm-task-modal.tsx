"use client";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { Pill } from "@/components/pm/ui/pill";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import {
  checklistProgress,
  pmStatus,
  PM_STATUS_TONE,
  type PreventiveTask,
} from "@/lib/fs/preventive-data";
import {
  completePmRound,
  togglePmChecklistItem,
} from "@/lib/fs/preventive-store";
import { showFsToast } from "@/lib/fs/toast-store";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

/**
 * One servicing round, item by item. Closing it out is deliberately gated on a
 * full checklist — a round the supervisor has not verified in full is not a
 * round they can sign off.
 */
export function PmTaskModal({
  task,
  onClose,
}: {
  task: PreventiveTask;
  onClose: () => void;
}) {
  const { done, total } = checklistProgress(task);
  const status = pmStatus(task);
  const verified = total > 0 && done === total;

  function handleComplete(event: React.FormEvent) {
    event.preventDefault();
    if (!verified) return;

    completePmRound(task.id);
    showFsToast(`${task.asset} service signed off`);
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={task.asset}
      subtitle={`${task.id} · ${task.title}`}
      size="lg"
    >
      <form onSubmit={handleComplete}>
        <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone={PM_STATUS_TONE[status]}>{status}</Pill>
            <span className="text-[13px] text-muted">
              {task.frequency} · {task.time}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            <Detail
              label="Location"
              value={`${task.building} - ${task.location}`}
            />
            <Detail label="Assigned" value={task.technician ?? "Unassigned"} />
            <Detail label="Last Service" value={task.lastDone} />
            <Detail label="Next Service" value={task.nextDate} />
          </dl>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h4 className={SECTION}>Checklist</h4>
              <span className="text-[13px] font-medium text-muted">
                {done}/{total} verified
              </span>
            </div>

            <ul className="mt-3 space-y-3">
              {task.checklist.map((item) => (
                <li key={item.id}>
                  <Checkbox
                    id={`pm-${item.id}`}
                    label={item.label}
                    checked={item.done}
                    onChange={() => togglePmChecklistItem(task.id, item.id)}
                  />
                </li>
              ))}
            </ul>
          </section>

          {!verified && (
            <p className="text-[13px] text-muted">
              Tick every item to sign this round off and book the next one.
            </p>
          )}
        </div>

        <FsModalFooter
          onCancel={onClose}
          label="Mark Service Complete"
          disabled={!verified}
        />
      </form>
    </Modal>
  );
}
