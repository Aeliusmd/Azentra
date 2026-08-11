"use client";

import { useMemo, useState } from "react";
import { Package, Plus } from "lucide-react";

import { Pill } from "@/components/pm/ui/pill";
import { RequestMaterialModal } from "@/components/tech/materials/request-material-modal";
import { SegmentedFilter } from "@/components/tech/ui/segmented-filter";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  REQUEST_STATUS_TONE,
  STOCK_TONE,
  inventory,
  type Material,
} from "@/lib/tech/materials-data";
import {
  addMaterialRequest,
  useMaterialRequests,
} from "@/lib/tech/materials-store";
import { showToast } from "@/lib/tech/toast-store";

const TABS = ["Inventory", "Requests"] as const;
type Tab = (typeof TABS)[number];

const HEADINGS = ["ID", "Material", "Qty", "Status", "Date"];

function MaterialCard({ material }: { material: Material }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-ink">
            {material.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-muted">{material.category}</p>
        </div>
        <Pill tone={STOCK_TONE[material.stock]}>{material.stock}</Pill>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] text-gray-600">
          Qty: <span className="font-bold text-ink">{material.quantity}</span>{" "}
          {material.unit}
        </p>
        <p className="text-[13px] text-muted">{material.warehouse}</p>
      </div>
    </Card>
  );
}

export function MaterialsView() {
  const requests = useMaterialRequests();
  const [tab, setTab] = useState<Tab>("Inventory");
  const [query, setQuery] = useState("");
  const [requesting, setRequesting] = useState(false);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return inventory;
    return inventory.filter((material) =>
      [material.name, material.category, material.warehouse].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Materials</h1>
          <p className="mt-1 text-[13px] text-muted">
            Inventory and material requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRequesting(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Request Material
        </button>
      </div>

      <SegmentedFilter
        label="Materials view"
        options={TABS}
        value={tab}
        onChange={(value) => setTab(value as Tab)}
      />

      {tab === "Inventory" ? (
        <div className="space-y-5">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search materials..."
            label="Search materials"
          />

          {visible.length === 0 ? (
            <Card className="px-6 py-16 text-center">
              <Package
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-gray-300"
              />
              <p className="mt-3 text-[15px] font-semibold text-ink">
                No materials found
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Nothing in the stores matches &ldquo;{query}&rdquo;.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-hairline">
                  {HEADINGS.map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 text-left text-[15px] font-semibold text-ink"
                    >
                      {request.id}
                    </th>
                    <td className="px-5 py-4 text-[15px] text-ink">
                      {request.material}
                    </td>
                    <td className="px-5 py-4 text-[15px] whitespace-nowrap text-gray-600">
                      {request.quantity} {request.unit}
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone={REQUEST_STATUS_TONE[request.status]}>
                        {request.status}
                      </Pill>
                    </td>
                    <td className="px-5 py-4 text-[15px] whitespace-nowrap text-muted">
                      {request.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 && (
            <p className="px-6 py-12 text-center text-[15px] text-muted">
              You have not requested any material yet.
            </p>
          )}
        </Card>
      )}

      {requesting && (
        <RequestMaterialModal
          onClose={() => setRequesting(false)}
          onSubmit={(request) => {
            addMaterialRequest(request);
            showToast("Material request submitted");
            setRequesting(false);
            setTab("Requests");
          }}
        />
      )}
    </div>
  );
}
