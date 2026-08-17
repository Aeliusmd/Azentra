"use client";

import { FsModalFooter } from "@/components/fs/ui/modal-footer";
import { Modal } from "@/components/ui/modal";
import { lkr } from "@/lib/acc/money";
import { pushAccNotification } from "@/lib/acc/notifications-store";
import { periodLabel } from "@/lib/acc/periods";
import { accPropertyName } from "@/lib/acc/properties";
import { showAccToast } from "@/lib/acc/toast-store";

/**
 * Pushes the month's shared running costs out to residents, split evenly.
 *
 * The per-unit figure is rounded to the rupee for display, so quoting it back
 * against the unit count lands a few rupees short of the total — the real
 * remainder rides on the last unit's bill, as it does on paper.
 */
export function AllocateModal({
  propertyId,
  period,
  total,
  units,
  onClose,
}: {
  propertyId: string;
  period: string;
  total: number;
  units: number;
  onClose: () => void;
}) {
  const perUnit = units > 0 ? Math.round(total / units) : 0;

  function submit(event: React.FormEvent) {
    event.preventDefault();

    showAccToast(`${lkr(total)} allocated across ${units} units`);
    pushAccNotification(
      "Billing",
      "Common Area Costs Allocated",
      `${accPropertyName(propertyId)} · ${periodLabel(period)} — ${lkr(total)} split across ${units} units at ${lkr(perUnit)} each.`,
    );
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Allocate Common Area Costs">
      <form onSubmit={submit}>
        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <p className="text-[15px] text-ink">
            Distribute {lkr(total)} across all units?
          </p>
          <p className="mt-4 pl-3 text-[15px] text-gray-600">
            {units} units × {lkr(perUnit)} = {lkr(total)}
          </p>
        </div>

        <FsModalFooter onCancel={onClose} label="Allocate" />
      </form>
    </Modal>
  );
}
