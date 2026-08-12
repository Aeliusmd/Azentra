"use client";

import { useState } from "react";
import {
  Calendar,
  CirclePause,
  CirclePlay,
  StickyNote,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import {
  WorkOrderActionModal,
  type WorkOrderAction,
} from "@/components/fs/work-orders/work-order-action-modals";
import { Pill } from "@/components/pm/ui/pill";
import { Modal } from "@/components/ui/modal";
import { showFsToast } from "@/lib/fs/toast-store";
import {
  formatStamp,
  locationLabel,
  sourceOf,
  timelineFor,
  WO_PRIORITY_TONE,
  WO_STATUS_TONE,
  type FsWorkOrder,
} from "@/lib/fs/work-orders-data";
import { resumeWork } from "@/lib/fs/work-orders-store";

const SECTION = "text-[12px] font-semibold tracking-wide text-gray-400 uppercase";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[15px] text-muted">{label}:</dt>
      <dd className="min-w-0 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "warn";
}) {
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    outline: "border border-hairline text-ink hover:bg-gray-50",
    warn: "border border-amber-300 text-amber-700 hover:bg-amber-50",
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${styles}`}
    >
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      {label}
    </button>
  );
}

/**
 * Everything the supervisor needs to act on one job: where it came from, who
 * has it, what has been used, and the history so far. The footer actions are
 * the four moves that belong to the supervisor rather than the technician.
 */
export function WorkOrderDetailModal({
  order,
  onClose,
}: {
  order: FsWorkOrder;
  onClose: () => void;
}) {
  const [action, setAction] = useState<WorkOrderAction | null>(null);

  const timeline = timelineFor(order);
  const onHold = order.status === "On Hold";

  return (
    <>
      {/* Swapped out while an action dialog is up, so only one dialog owns
          focus and the Escape key at a time. */}
      <Modal
        open={action === null}
        onClose={onClose}
        title={`Work Order ${order.id}`}
        size="lg"
      >
        <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone={WO_STATUS_TONE[order.status]}>{order.status}</Pill>
            <Pill tone={WO_PRIORITY_TONE[order.priority]}>
              {order.priority}
            </Pill>
            <span className="text-[13px] text-muted">{order.requestedAt}</span>
          </div>

          <div>
            <h3 className="text-[19px] font-bold text-ink">{order.title}</h3>
            <p className="mt-1.5 text-[15px] text-muted">{order.description}</p>
          </div>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            <Detail label="Source" value={sourceOf(order)} />
            <Detail label="Location" value={locationLabel(order, " - ")} />
            <Detail
              label="Technician"
              value={order.technician ?? "Unassigned"}
            />
            <Detail
              label="Scheduled"
              value={
                order.scheduledDate
                  ? `${order.scheduledDate} at ${order.scheduledTime}`
                  : "Not scheduled"
              }
            />
            <Detail label="Type" value={order.workType ?? order.category} />
            <Detail label="Due" value={order.dueDate} />
          </dl>

          {order.checklist && order.checklist.length > 0 && (
            <section>
              <h4 className={SECTION}>Checklist</h4>
              <ul className="mt-2.5 space-y-1.5">
                {order.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[15px] text-gray-600"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {order.materials.length > 0 && (
            <section>
              <h4 className={SECTION}>Materials</h4>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {order.materials.map((material) => (
                  <li
                    key={material.id}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-[13px] text-gray-700"
                  >
                    {material.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {order.delayReason && (
            <section>
              <h4 className={SECTION}>Delay Reason</h4>
              <p className="mt-2 rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
                {order.delayReason}
              </p>
            </section>
          )}

          <section>
            <h4 className={SECTION}>Progress</h4>
            <span
              role="img"
              aria-label={`${order.progress}% complete`}
              className="mt-2.5 block h-2 w-full overflow-hidden rounded-full bg-gray-200"
            >
              <span
                className="block h-full rounded-full bg-brand transition-[width]"
                style={{ width: `${order.progress}%` }}
              />
            </span>
            <p className="mt-2 text-[13px] text-muted">
              {order.progress}% complete
              {order.expectedCompletion
                ? ` · expected ${formatStamp(order.expectedCompletion)}`
                : ""}
            </p>
          </section>

          <section>
            <h4 className={SECTION}>Timeline</h4>
            <ul className="mt-3 space-y-3">
              {timeline.map((event) => (
                <li
                  key={`${event.label}-${event.time}`}
                  className="flex items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand"
                  />
                  <span className="min-w-0 flex-1 text-[15px] text-ink">
                    {event.label}
                  </span>
                  <span className="shrink-0 text-[13px] whitespace-nowrap text-muted">
                    {formatStamp(event.time)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {order.notes.length > 0 && (
            <section>
              <h4 className={SECTION}>Notes</h4>
              <ul className="mt-3 space-y-3">
                {order.notes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-lg border border-hairline p-3.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">
                        {note.author}
                      </span>
                      <span className="text-[13px] text-muted">
                        {formatStamp(note.time)}
                      </span>
                    </div>
                    <p className="mt-1 text-[15px] text-gray-600">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-hairline px-8 py-5">
          <ActionButton
            icon={UserRoundCheck}
            variant="primary"
            label={order.technician ? "Reassign" : "Assign"}
            onClick={() => setAction("reassign")}
          />
          <ActionButton
            icon={Calendar}
            label={order.scheduledDate ? "Reschedule" : "Schedule"}
            onClick={() => setAction("reschedule")}
          />
          <ActionButton
            icon={StickyNote}
            label="Add Note"
            onClick={() => setAction("note")}
          />
          {onHold ? (
            <ActionButton
              icon={CirclePlay}
              label="Resume Work"
              onClick={() => {
                resumeWork(order.id);
                showFsToast("Job resumed");
              }}
            />
          ) : (
            <ActionButton
              icon={CirclePause}
              variant="warn"
              label="Put On Hold"
              onClick={() => setAction("hold")}
            />
          )}
        </div>
      </Modal>

      {action && (
        <WorkOrderActionModal
          action={action}
          order={order}
          onClose={() => setAction(null)}
        />
      )}
    </>
  );
}
