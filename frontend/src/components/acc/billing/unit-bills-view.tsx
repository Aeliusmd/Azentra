"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { BillDetailModal } from "@/components/acc/billing/bill-detail-modal";
import { GenerateBillModal } from "@/components/acc/billing/generate-bill-modal";
import { AccRecordRow } from "@/components/acc/ui/record-row";
import { AccStatusChips } from "@/components/acc/ui/status-chips";
import { BillStatusPill } from "@/components/acc/ui/status-pill";
import { FsPagination } from "@/components/fs/ui/pagination";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { lkr } from "@/lib/acc/money";
import { periodLabel, useSelectedAccPeriod } from "@/lib/acc/periods";
import { useSelectedAccProperty } from "@/lib/acc/properties";
import { BILL_STATUS_FILTERS } from "@/lib/acc/unit-bills-data";
import { useAccUnitBills } from "@/lib/acc/unit-bills-store";

const HEADINGS = [
  "Bill ID",
  "Unit",
  "Resident",
  "Period",
  "Total",
  "Due Date",
  "Status",
];

const PAGE_SIZE = 10;

const CELL = "px-5 py-3.5 text-[14px] whitespace-nowrap";

export function AccUnitBillsView() {
  const allBills = useAccUnitBills();
  const propertyId = useSelectedAccProperty();
  const period = useSelectedAccPeriod();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  // Only the books this accountant is scoped to, for the month in the header.
  const inScope = useMemo(
    () =>
      allBills.filter(
        (bill) => bill.propertyId === propertyId && bill.period === period,
      ),
    [allBills, propertyId, period],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return inScope.filter((bill) => {
      if (status !== "All" && bill.status !== status) return false;
      if (!term) return true;

      return [bill.id, bill.unit, bill.resident]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [inScope, search, status]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Any filter change starts the list again from the top.
  function withReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const openBill = allBills.find((bill) => bill.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-tight font-bold text-ink">
            Unit Bills
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            Manage and track all unit bills
          </p>
        </div>

        <button
          type="button"
          onClick={() => setGenerateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
          Generate Bill
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={withReset(setSearch)}
          placeholder="Search unit or resident..."
          label="Search unit bills"
          className="w-full sm:w-[300px]"
        />
        <AccStatusChips
          label="Filter by status"
          options={BILL_STATUS_FILTERS}
          value={status}
          onChange={withReset(setStatus)}
        />
      </div>

      <Card>
        {/* Phones get the stacked list below; the table needs the width. */}
        <ul className="divide-y divide-hairline md:hidden">
          {rows.map((bill) => (
            <AccRecordRow
              key={bill.id}
              id={bill.id}
              title={bill.resident}
              subtitle={`${bill.unit} · ${periodLabel(bill.period)}`}
              status={<BillStatusPill status={bill.status} />}
              meta={[
                { label: "Total", value: lkr(bill.total) },
                { label: "Due", value: bill.dueDate },
              ]}
              onOpen={() => setOpenId(bill.id)}
            />
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-hairline">
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3.5 text-[13px] font-medium text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-hairline">
              {rows.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => setOpenId(bill.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70"
                >
                  <th scope="row" className={`${CELL} text-left font-normal`}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenId(bill.id);
                      }}
                      aria-haspopup="dialog"
                      className="font-medium text-link transition-colors hover:text-link-dark focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
                    >
                      {bill.id}
                    </button>
                  </th>
                  <td className={`${CELL} text-gray-700`}>{bill.unit}</td>
                  <td className={`${CELL} text-gray-700`}>{bill.resident}</td>
                  <td className={`${CELL} text-gray-600`}>
                    {periodLabel(bill.period)}
                  </td>
                  <td className={`${CELL} font-bold text-ink`}>
                    {lkr(bill.total)}
                  </td>
                  <td className={`${CELL} text-gray-600`}>{bill.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <BillStatusPill status={bill.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-[15px] text-muted">
            No unit bills match these filters.
          </p>
        ) : (
          <FsPagination
            page={current}
            pageCount={pageCount}
            total={visible.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            noun="bills"
          />
        )}
      </Card>

      {openBill && (
        <BillDetailModal bill={openBill} onClose={() => setOpenId(null)} />
      )}

      {generateOpen && (
        <GenerateBillModal
          propertyId={propertyId}
          period={period}
          existing={inScope}
          onClose={() => setGenerateOpen(false)}
        />
      )}
    </div>
  );
}
