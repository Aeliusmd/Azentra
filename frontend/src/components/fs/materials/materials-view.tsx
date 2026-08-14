"use client";

import { useMemo, useState } from "react";
import { Package } from "lucide-react";

import { MaterialRequestModal } from "@/components/fs/materials/material-request-modal";
import { FsFilterChips } from "@/components/fs/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import { Card } from "@/components/ui/card";
import {
  byRequestOrder,
  MATERIAL_STATUS_TONE,
  MATERIAL_STATUSES,
  type FsMaterialRequest,
} from "@/lib/fs/materials-data";
import { useFsMaterialRequests } from "@/lib/fs/materials-store";
import { useSelectedFsProperty } from "@/lib/fs/properties";

const FILTERS = ["All", ...MATERIAL_STATUSES] as const;

function RequestRow({
  request,
  onOpen,
}: {
  request: FsMaterialRequest;
  onOpen: () => void;
}) {
  return (
    <Card>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-gray-50/70 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"
        >
          <Package className="h-[18px] w-[18px]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-ink">
            {request.material}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-muted">
            {request.quantity} · {request.workOrderId} - {request.job}
          </span>
        </span>

        <Pill tone={MATERIAL_STATUS_TONE[request.status]}>
          {request.status}
        </Pill>
      </button>
    </Card>
  );
}

/**
 * The material queue for this property. Anything still pending sits at the top,
 * because the only thing this page is for is clearing those decisions.
 */
export function FsMaterialsView() {
  const propertyId = useSelectedFsProperty();
  const requests = useFsMaterialRequests();

  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      requests
        .filter(
          (request) =>
            request.propertyId === propertyId &&
            (filter === "All" || request.status === filter),
        )
        .sort(byRequestOrder),
    [requests, propertyId, filter],
  );

  const openRequest =
    requests.find((request) => request.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-tight font-bold text-ink">
          Materials
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Review and approve technician material requests
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FsFilterChips
          label="Filter requests by status"
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />
        <p className="text-[13px] text-muted">
          {visible.length} request{visible.length === 1 ? "" : "s"}
        </p>
      </div>

      {visible.length === 0 ? (
        <Card className="px-6 py-16 text-center text-[15px] text-muted">
          No material requests with this status.
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((request) => (
            <li key={request.id}>
              <RequestRow
                request={request}
                onOpen={() => setOpenId(request.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {openRequest && (
        <MaterialRequestModal
          request={openRequest}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
